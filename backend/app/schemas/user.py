from typing import Literal

from pydantic import BaseModel, Field


class UserUpdateRequest(BaseModel):
    role: Literal["admin", "member"] | None = None
    is_active: bool | None = None


class PasswordResetRequest(BaseModel):
    new_password: str = Field(min_length=8)
