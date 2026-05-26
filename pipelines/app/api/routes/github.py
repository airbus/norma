import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from app.core.database import SessionLocal
from app.tasks.github_processor import generate_architecture, generate_summary

router = APIRouter(prefix="/api/github", tags=["github"])


class ProcessRequest(BaseModel):
    integration_id: str
    language: str = "en"


class ProcessResponse(BaseModel):
    integration_id: str
    status: str


@router.post("/process", response_model=ProcessResponse)
async def process_github_data(body: ProcessRequest):
    try:
        uuid.UUID(body.integration_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid integration_id") from e

    tasks_query = text(
        "SELECT github_id, title, body, status, assignees, labels FROM github_tasks WHERE integration_id = :id"
    )
    files_query = text("SELECT file_path, content FROM github_repo_files WHERE integration_id = :id")

    db = SessionLocal()
    try:
        tasks_rows = db.execute(tasks_query, {"id": body.integration_id}).fetchall()
        files_rows = db.execute(files_query, {"id": body.integration_id}).fetchall()
    finally:
        db.close()

    tasks_text = ""
    for row in tasks_rows:
        github_id, title, task_body, status, assignees, labels = row
        tasks_text += f"- #{github_id} [{status}] {title}"
        if assignees:
            tasks_text += f" (assignees: {', '.join(assignees)})"
        if labels:
            tasks_text += f" [labels: {', '.join(labels)}]"
        tasks_text += "\n"
        if task_body:
            tasks_text += f"  {task_body[:500]}\n"

    files_text = ""
    tree_text = ""
    for row in files_rows:
        file_path, content = row
        tree_text += f"  {file_path}\n"
        if content:
            files_text += f"### {file_path}\n```\n{content[:10_000]}\n```\n\n"

    if not tasks_text:
        tasks_text = "No tasks/issues found."
    if not files_text:
        files_text = "No source files available."

    summary = await generate_summary(tasks_text, files_text, language=body.language)
    architecture = await generate_architecture(tree_text, files_text, language=body.language)

    db = SessionLocal()
    try:
        db.execute(
            text(
                "UPDATE integrations SET summary = :summary, architecture_mermaid = :mermaid, "
                "sync_status = 'completed', last_synced_at = now() WHERE id = :id"
            ),
            {"summary": summary, "mermaid": architecture, "id": body.integration_id},
        )
        db.commit()

        row = db.execute(
            text("SELECT project_id FROM integrations WHERE id = :id"),
            {"id": body.integration_id},
        ).fetchone()
    finally:
        db.close()

    if row:
        project_id = str(row[0])
        out_dir = Path("/data/projects") / project_id
        out_dir.mkdir(parents=True, exist_ok=True)
        md = f"# GitHub Context\n\n## Summary\n\n{summary}\n\n## Architecture\n\n{architecture}\n"
        (out_dir / "github-context.md").write_text(md, encoding="utf-8")

    return ProcessResponse(integration_id=body.integration_id, status="completed")
