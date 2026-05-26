import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Integration(Base):
    __tablename__ = "integrations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"), unique=True)
    provider: Mapped[str] = mapped_column(String(50), default="github")
    github_pat: Mapped[str] = mapped_column(String(500))
    repo_owner: Mapped[str] = mapped_column(String(255))
    repo_name: Mapped[str] = mapped_column(String(255))
    github_project_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    architecture_mermaid: Mapped[str | None] = mapped_column(Text, nullable=True)
    sync_status: Mapped[str] = mapped_column(String(50), default="idle")
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="integration")
    tasks = relationship("GitHubTask", back_populates="integration", cascade="all, delete-orphan")
    repo_files = relationship("GitHubRepoFile", back_populates="integration", cascade="all, delete-orphan")


class GitHubTask(Base):
    __tablename__ = "github_tasks"
    __table_args__ = (UniqueConstraint("integration_id", "github_id"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    integration_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("integrations.id"))
    github_id: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(500))
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50))
    assignees: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    labels: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    milestone: Mapped[str | None] = mapped_column(String(255), nullable=True)
    github_url: Mapped[str] = mapped_column(String(500))
    github_created_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    github_updated_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    integration = relationship("Integration", back_populates="tasks")


class GitHubRepoFile(Base):
    __tablename__ = "github_repo_files"
    __table_args__ = (UniqueConstraint("integration_id", "file_path"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    integration_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("integrations.id"))
    file_path: Mapped[str] = mapped_column(String(500))
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    integration = relationship("Integration", back_populates="repo_files")
