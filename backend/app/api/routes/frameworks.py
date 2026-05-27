import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.document import Document, DocumentDefinition
from app.models.framework import Framework
from app.models.user import User
from app.schemas.framework import (
    AddFrameworkRequest,
    AvailableFrameworkResponse,
    FrameworkResponse,
)
from app.services.seed import SEED_FRAMEWORKS, _load_knowledge

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


@router.get("/available", response_model=list[AvailableFrameworkResponse])
def list_available_frameworks(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    existing_names = {name for (name,) in db.query(Framework.name).all()}
    return [
        {"name": fw["name"], "description": fw["description"], "category": fw["category"]}
        for fw in SEED_FRAMEWORKS
        if fw["name"] not in existing_names and fw["name"] != "EU AI Act"
    ]


@router.post("", response_model=FrameworkResponse)
def add_framework(
    body: AddFrameworkRequest,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    seed_data = next((fw for fw in SEED_FRAMEWORKS if fw["name"] == body.name), None)
    if not seed_data:
        raise HTTPException(status_code=404, detail="Framework not found in catalogue")

    if db.query(Framework).filter(Framework.name == body.name).first():
        raise HTTPException(status_code=409, detail="Framework already exists")

    fw = Framework(
        name=seed_data["name"],
        description=seed_data["description"],
        category=seed_data["category"],
        status=seed_data["status"],
        content=_load_knowledge(seed_data["name"]),
    )
    db.add(fw)
    db.flush()

    for doc_data in seed_data["documents"]:
        db.add(
            DocumentDefinition(
                framework_id=fw.id,
                name=doc_data["name"],
                description=doc_data["description"],
                article=doc_data["article"],
            )
        )

    db.commit()
    db.refresh(fw)
    return _to_response(fw)


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


@router.delete("/{framework_id}")
def delete_framework(
    framework_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    fw = db.query(Framework).filter(Framework.id == framework_id).first()
    if not fw:
        raise HTTPException(status_code=404, detail="Framework not found")

    if fw.name == "EU AI Act":
        raise HTTPException(status_code=403, detail="This framework cannot be removed")

    def_ids = [d.id for d in fw.document_definitions]
    if def_ids:
        db.query(Document).filter(Document.definition_id.in_(def_ids)).delete()

    db.delete(fw)
    db.commit()
    return {"detail": "Framework deleted"}
