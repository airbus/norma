import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentDefinitionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str
    article: str
    framework_id: uuid.UUID


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID
    definition_id: uuid.UUID
    name: str
    description: str
    article: str
    framework_name: str
    framework_id: uuid.UUID
    uploaded: bool
    file_name: str | None
    summary: str | None
    uploaded_at: datetime | None
