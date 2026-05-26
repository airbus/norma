import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from app.core.database import SessionLocal
from app.tasks.document_processor import process_document

router = APIRouter(prefix="/api/documents", tags=["documents"])


ALLOWED_TABLES = {"documents", "custom_documents"}


class ProcessRequest(BaseModel):
    document_id: str
    file_path: str
    table_name: str = "documents"
    language: str = "en"


class ProcessResponse(BaseModel):
    document_id: str
    summary: str


@router.post("/process", response_model=ProcessResponse)
async def process_document_endpoint(body: ProcessRequest):
    try:
        uuid.UUID(body.document_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid document_id") from e

    if body.table_name not in ALLOWED_TABLES:
        raise HTTPException(status_code=400, detail="Invalid table_name")

    summary = await process_document(body.file_path, language=body.language)

    db = SessionLocal()
    try:
        db.execute(
            text(f"UPDATE {body.table_name} SET summary = :summary WHERE id = :doc_id"),
            {"summary": summary, "doc_id": body.document_id},
        )
        db.commit()
    finally:
        db.close()

    return ProcessResponse(document_id=body.document_id, summary=summary)
