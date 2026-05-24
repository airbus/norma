import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str = ""
    risk_classification: Literal["unacceptable", "high", "limited", "minimal"] = "minimal"
    intended_purpose: str = ""
    intended_users: str = ""
    deployment_context: str = ""
    questionnaire_answers: dict | None = None


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    risk_classification: Literal["unacceptable", "high", "limited", "minimal"] | None = None
    intended_purpose: str | None = None
    intended_users: str | None = None
    deployment_context: str | None = None
    questionnaire_answers: dict | None = None


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str
    risk_classification: str
    intended_purpose: str
    intended_users: str
    deployment_context: str
    questionnaire_answers: dict | None
    created_at: datetime
    updated_at: datetime
