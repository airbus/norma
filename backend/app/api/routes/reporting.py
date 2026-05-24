import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.project import Project
from app.models.reporting import ReportingEvidence
from app.models.user import User
from app.schemas.reporting import EvidenceBulkUpsert, EvidenceResponse

router = APIRouter(prefix="/api/projects/{project_id}/reporting", tags=["reporting"])


def _get_project(project_id: uuid.UUID, user: User, db: Session) -> Project:
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("", response_model=list[EvidenceResponse])
def list_evidence(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    return db.query(ReportingEvidence).filter(ReportingEvidence.project_id == project.id).all()


@router.put("", response_model=list[EvidenceResponse])
def bulk_upsert_evidence(
    project_id: uuid.UUID,
    body: EvidenceBulkUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)

    for item in body.items:
        existing = (
            db.query(ReportingEvidence)
            .filter(ReportingEvidence.project_id == project.id, ReportingEvidence.item_key == item.item_key)
            .first()
        )
        if existing:
            existing.comment = item.comment
        else:
            db.add(ReportingEvidence(project_id=project.id, item_key=item.item_key, comment=item.comment))

    db.commit()
    return db.query(ReportingEvidence).filter(ReportingEvidence.project_id == project.id).all()
