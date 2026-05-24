import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.risk_evaluation import evaluate_risk

router = APIRouter(prefix="/api/projects", tags=["projects"])

RISK_RELEVANT_FIELDS = {
    "description",
    "intended_purpose",
    "intended_users",
    "deployment_context",
    "questionnaire_answers",
}


async def _run_evaluation(project: Project, db: Session) -> None:
    result = await evaluate_risk(
        description=project.description,
        intended_purpose=project.intended_purpose,
        intended_users=project.intended_users,
        deployment_context=project.deployment_context,
        questionnaire_answers=project.questionnaire_answers,
    )
    if result:
        project.risk_classification = result
        db.commit()
        db.refresh(project)


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(
    body: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = Project(owner_id=current_user.id, **body.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)

    has_context = body.description or body.intended_purpose or body.intended_users or body.deployment_context
    if has_context or body.questionnaire_answers:
        await _run_evaluation(project, db)

    return project


@router.get("", response_model=list[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Project).filter(Project.owner_id == current_user.id).order_by(Project.created_at).all()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: uuid.UUID,
    body: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    updated_fields = body.model_dump(exclude_unset=True)
    for field, value in updated_fields.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    if updated_fields.keys() & RISK_RELEVANT_FIELDS:
        await _run_evaluation(project, db)

    return project


@router.post("/{project_id}/evaluate-risk", response_model=ProjectResponse)
async def evaluate_project_risk(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await _run_evaluation(project, db)
    return project


@router.delete("/{project_id}")
def delete_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"detail": "Project deleted"}
