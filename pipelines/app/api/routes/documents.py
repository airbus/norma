import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from app.core.database import SessionLocal
from app.tasks.document_processor import process_document

router = APIRouter(prefix="/api/documents", tags=["documents"])


class ProcessRequest(BaseModel):
    document_id: str
    file_path: str


class ProcessResponse(BaseModel):
    document_id: str
    summary: str


@router.post("/process", response_model=ProcessResponse)
async def process_document_endpoint(body: ProcessRequest):
    try:
        uuid.UUID(body.document_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid document_id") from e

    summary = await process_document(body.file_path)

    db = SessionLocal()
    try:
        db.execute(
            text("UPDATE documents SET summary = :summary WHERE id = :doc_id"),
            {"summary": summary, "doc_id": body.document_id},
        )
        db.commit()
    finally:
        db.close()

    return ProcessResponse(document_id=body.document_id, summary=summary)
