import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr


class InviteCreateRequest(BaseModel):
    email: EmailStr | None = None
    role: Literal["admin", "member"] = "member"


class InviteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    token: str
    email: str | None
    role: str
    created_at: datetime
    expires_at: datetime
    used_at: datetime | None
