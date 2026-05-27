import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.framework import Framework
from app.models.user import User
from app.schemas.framework import FrameworkResponse

router = APIRouter(prefix="/api/frameworks", tags=["frameworks"])


def _to_response(fw: Framework) -> dict:
    return {
        "id": fw.id,
        "name": fw.name,
        "description": fw.description,
        "category": fw.category,
        "status": fw.status,
        "content": fw.content,
        "document_count": len(fw.document_definitions),
        "created_at": fw.created_at,
    }


@router.get("", response_model=list[FrameworkResponse])
def list_frameworks(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    frameworks = db.query(Framework).order_by(Framework.created_at).all()
    return [_to_response(fw) for fw in frameworks]


@router.get("/{framework_id}", response_model=FrameworkResponse)
def get_framework(
    framework_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    fw = db.query(Framework).filter(Framework.id == framework_id).first()
    if not fw:
        raise HTTPException(status_code=404, detail="Framework not found")
    return _to_response(fw)
