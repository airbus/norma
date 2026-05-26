import logging
import uuid
from pathlib import Path

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.integration import GitHubRepoFile, GitHubTask, Integration
from app.models.project import Project
from app.models.user import User
from app.schemas.integration import (
    GitHubTaskResponse,
    IntegrationCreate,
    IntegrationResponse,
    IntegrationUpdate,
    SyncResponse,
)
from app.services.github_client import fetch_file_content, fetch_issues, fetch_repo_tree, select_key_files

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/projects/{project_id}/integrations", tags=["integrations"])


def _get_project(project_id: uuid.UUID, user: User, db: Session) -> Project:
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("", response_model=IntegrationResponse)
def get_integration(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    integration = db.query(Integration).filter(Integration.project_id == project_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="No integration configured")
    return integration


@router.post("", response_model=IntegrationResponse, status_code=201)
def create_integration(
    project_id: uuid.UUID,
    body: IntegrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    existing = db.query(Integration).filter(Integration.project_id == project.id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Integration already exists")

    integration = Integration(
        project_id=project.id,
        github_pat=body.github_pat,
        repo_owner=body.repo_owner,
        repo_name=body.repo_name,
        github_project_number=body.github_project_number,
    )
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration


@router.patch("", response_model=IntegrationResponse)
def update_integration(
    project_id: uuid.UUID,
    body: IntegrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    integration = db.query(Integration).filter(Integration.project_id == project_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="No integration configured")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(integration, field, value)
    db.commit()
    db.refresh(integration)
    return integration


@router.delete("", status_code=204)
def delete_integration(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    integration = db.query(Integration).filter(Integration.project_id == project_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="No integration configured")
    db.delete(integration)
    db.commit()


@router.get("/sync-status")
def get_sync_status(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    integration = db.query(Integration).filter(Integration.project_id == project_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="No integration configured")
    db.expire(integration)
    return {"sync_status": integration.sync_status}


CONTEXT_DIR = Path("/data/projects")


class ContextFileBody(BaseModel):
    content: str


@router.get("/context-file")
def get_context_file(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    file_path = CONTEXT_DIR / str(project_id) / "github-context.md"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Context file not found")
    return {"content": file_path.read_text(encoding="utf-8")}


@router.put("/context-file")
def update_context_file(
    project_id: uuid.UUID,
    body: ContextFileBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    out_dir = CONTEXT_DIR / str(project_id)
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "github-context.md").write_text(body.content, encoding="utf-8")
    return {"status": "saved"}


@router.post("/sync", response_model=SyncResponse)
async def sync_integration(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    integration = db.query(Integration).filter(Integration.project_id == project_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="No integration configured")

    def _set_status(status: str) -> None:
        integration.sync_status = status
        db.commit()

    _set_status("syncing:issues")

    pat = integration.github_pat
    owner = integration.repo_owner
    repo = integration.repo_name

    try:
        issues = await fetch_issues(pat, owner, repo)

        db.query(GitHubTask).filter(GitHubTask.integration_id == integration.id).delete()
        for issue in issues:
            db.add(GitHubTask(integration_id=integration.id, **issue))
        db.commit()

        _set_status("syncing:tree")
        all_paths = await fetch_repo_tree(pat, owner, repo)
        key_paths = select_key_files(all_paths)

        _set_status("syncing:files")
        db.query(GitHubRepoFile).filter(GitHubRepoFile.integration_id == integration.id).delete()
        for path in key_paths:
            try:
                content = await fetch_file_content(pat, owner, repo, path)
                db.add(GitHubRepoFile(integration_id=integration.id, file_path=path, content=content))
            except Exception:
                logger.warning("Failed to fetch file: %s/%s/%s", owner, repo, path)
        db.commit()

        _set_status("syncing:analysis")
        async with httpx.AsyncClient() as client:
            for attempt in range(3):
                try:
                    resp = await client.post(
                        f"{settings.pipelines_url}/api/github/process",
                        json={
                            "integration_id": str(integration.id),
                            "language": current_user.language_preference or "en",
                        },
                        timeout=300,
                    )
                    resp.raise_for_status()
                    break
                except httpx.ConnectError:
                    if attempt == 2:
                        raise
                    import asyncio

                    await asyncio.sleep(2**attempt)

        db.refresh(integration)
        return SyncResponse(status=integration.sync_status, message="Sync completed")

    except Exception as exc:
        logger.exception("Sync failed for integration %s", integration.id)
        integration.sync_status = "error"
        db.commit()
        return SyncResponse(status="error", message=str(exc))


@router.get("/tasks", response_model=list[GitHubTaskResponse])
def list_tasks(
    project_id: uuid.UUID,
    status: str | None = None,
    assignee: str | None = None,
    label: str | None = None,
    milestone: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    integration = db.query(Integration).filter(Integration.project_id == project_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="No integration configured")

    query = db.query(GitHubTask).filter(GitHubTask.integration_id == integration.id)
    if status:
        query = query.filter(GitHubTask.status == status)
    if assignee:
        query = query.filter(GitHubTask.assignees.contains([assignee]))
    if label:
        query = query.filter(GitHubTask.labels.contains([label]))
    if milestone:
        query = query.filter(GitHubTask.milestone == milestone)

    return query.order_by(GitHubTask.github_id.desc()).all()


@router.get("/tasks/{task_id}", response_model=GitHubTaskResponse)
def get_task(
    project_id: uuid.UUID,
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_project(project_id, current_user, db)
    task = db.query(GitHubTask).filter(GitHubTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
