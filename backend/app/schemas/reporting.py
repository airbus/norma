import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EvidenceUpsert(BaseModel):
    item_key: str
    comment: str


class EvidenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID
    item_key: str
    comment: str
    updated_at: datetime


class EvidenceBulkUpsert(BaseModel):
    items: list[EvidenceUpsert]
