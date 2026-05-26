import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class IntegrationCreate(BaseModel):
    github_pat: str = Field(min_length=1, max_length=500)
    repo_owner: str = Field(min_length=1, max_length=255)
    repo_name: str = Field(min_length=1, max_length=255)
    github_project_number: int | None = None


class IntegrationUpdate(BaseModel):
    github_pat: str | None = Field(default=None, min_length=1, max_length=500)
    repo_owner: str | None = Field(default=None, min_length=1, max_length=255)
    repo_name: str | None = Field(default=None, min_length=1, max_length=255)
    github_project_number: int | None = None


class IntegrationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID
    provider: str
    repo_owner: str
    repo_name: str
    github_project_number: int | None
    summary: str | None
    architecture_mermaid: str | None
    sync_status: str
    last_synced_at: datetime | None
    created_at: datetime
    updated_at: datetime


class GitHubTaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    integration_id: uuid.UUID
    github_id: int
    title: str
    body: str | None
    status: str
    assignees: list[str] | None
    labels: list[str] | None
    milestone: str | None
    github_url: str
    github_created_at: datetime | None
    github_updated_at: datetime | None


class SyncResponse(BaseModel):
    status: str
    message: str
