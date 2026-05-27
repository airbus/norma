import uuid
from datetime import UTC, datetime
from pathlib import Path

import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.custom_document import CustomDocument
from app.models.document import Document, DocumentDefinition
from app.models.project import Project
from app.models.user import User
from app.schemas.document import CustomDocumentResponse, DocumentResponse

router = APIRouter(prefix="/api/projects/{project_id}/documents", tags=["documents"])

UPLOAD_DIR = Path("/data/uploads")


def _get_project(project_id: uuid.UUID, user: User, db: Session) -> Project:
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def _ensure_project_documents(project: Project, db: Session) -> None:
    existing = db.query(Document.definition_id).filter(Document.project_id == project.id).all()
    existing_ids = {row[0] for row in existing}
    definitions = db.query(DocumentDefinition).all()
    for defn in definitions:
        if defn.id not in existing_ids:
            db.add(Document(project_id=project.id, definition_id=defn.id))
    db.commit()


def _to_response(doc: Document) -> dict:
    defn = doc.definition
    return {
        "id": doc.id,
        "project_id": doc.project_id,
        "definition_id": doc.definition_id,
        "name": defn.name,
        "description": defn.description,
        "article": defn.article,
        "framework_name": defn.framework.name,
        "framework_id": defn.framework_id,
        "uploaded": doc.file_path is not None,
        "file_name": doc.file_name,
        "summary": doc.summary,
        "uploaded_at": doc.uploaded_at,
    }


@router.get("", response_model=list[DocumentResponse])
def list_documents(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    _ensure_project_documents(project, db)
    docs = (
        db.query(Document)
        .filter(Document.project_id == project.id)
        .join(DocumentDefinition)
        .order_by(DocumentDefinition.article)
        .all()
    )
    return [_to_response(d) for d in docs]


@router.get("/custom", response_model=list[CustomDocumentResponse])
def list_custom_documents(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    return (
        db.query(CustomDocument)
        .filter(CustomDocument.project_id == project.id)
        .order_by(CustomDocument.uploaded_at.desc())
        .all()
    )


@router.post("/custom/upload", response_model=CustomDocumentResponse)
async def upload_custom_document(
    project_id: uuid.UUID,
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    doc_id = uuid.uuid4()
    upload_dir = UPLOAD_DIR / str(project.id) / "custom"
    upload_dir.mkdir(parents=True, exist_ok=True)

    stored_name = f"{doc_id}.pdf"
    file_path = upload_dir / stored_name

    content = await file.read()
    file_path.write_bytes(content)

    custom_doc = CustomDocument(
        id=doc_id,
        project_id=project.id,
        file_name=file.filename,
        file_path=str(file_path),
        uploaded_at=datetime.now(UTC),
    )
    db.add(custom_doc)
    db.commit()
    db.refresh(custom_doc)

    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{settings.pipelines_url}/api/documents/process",
                json={
                    "document_id": str(custom_doc.id),
                    "file_path": str(file_path),
                    "table_name": "custom_documents",
                    "language": current_user.language_preference or "en",
                },
                timeout=300,
            )
    except Exception:
        pass

    db.refresh(custom_doc)
    return custom_doc


@router.delete("/custom/{document_id}", status_code=204)
def delete_custom_document(
    project_id: uuid.UUID,
    document_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    doc = (
        db.query(CustomDocument)
        .filter(CustomDocument.id == document_id, CustomDocument.project_id == project.id)
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = Path(doc.file_path)
    if file_path.exists():
        file_path.unlink()

    db.delete(doc)
    db.commit()


@router.delete("/{document_id}/upload", response_model=DocumentResponse)
def remove_uploaded_document(
    project_id: uuid.UUID,
    document_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    doc = db.query(Document).filter(Document.id == document_id, Document.project_id == project.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if doc.file_path:
        file_path = Path(doc.file_path)
        if file_path.exists():
            file_path.unlink()

    doc.file_path = None
    doc.file_name = None
    doc.summary = None
    doc.uploaded_at = None
    db.commit()
    db.refresh(doc)
    return _to_response(doc)


@router.post("/{document_id}/upload", response_model=DocumentResponse)
async def upload_document(
    project_id: uuid.UUID,
    document_id: uuid.UUID,
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    doc = db.query(Document).filter(Document.id == document_id, Document.project_id == project.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    upload_dir = UPLOAD_DIR / str(project.id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_ext = Path(file.filename).suffix if file.filename else ""
    stored_name = f"{document_id}{file_ext}"
    file_path = upload_dir / stored_name

    content = await file.read()
    file_path.write_bytes(content)

    doc.file_path = str(file_path)
    doc.file_name = file.filename
    doc.uploaded_at = datetime.now(UTC)
    db.commit()
    db.refresh(doc)

    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{settings.pipelines_url}/api/documents/process",
                json={
                    "document_id": str(doc.id),
                    "file_path": str(file_path),
                    "language": current_user.language_preference or "en",
                },
                timeout=300,
            )
    except Exception:
        pass

    return _to_response(doc)
