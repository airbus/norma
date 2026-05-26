import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EvidenceUpsert(BaseModel):
    item_key: str
    comment: str
    covered: bool | None = None
    feedback: str | None = None


class EvidenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID
    item_key: str
    comment: str
    covered: bool | None = None
    feedback: str | None = None
    updated_at: datetime


class EvidenceBulkUpsert(BaseModel):
    items: list[EvidenceUpsert]


class SuggestRequest(BaseModel):
    question: str
    current_comment: str = ""
    framework_id: str = ""


class SuggestResponse(BaseModel):
    suggestion: str


class ValidateRequest(BaseModel):
    question: str
    answer: str
    framework_id: str = ""


class ValidateResponse(BaseModel):
    covered: bool
    feedback: str
