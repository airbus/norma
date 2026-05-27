import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FrameworkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str
    category: str
    status: str
    content: str
    document_count: int
    created_at: datetime
