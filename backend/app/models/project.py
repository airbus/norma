import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    risk_classification: Mapped[str] = mapped_column(String(50), default="minimal")
    intended_purpose: Mapped[str] = mapped_column(Text, default="")
    intended_users: Mapped[str] = mapped_column(Text, default="")
    deployment_context: Mapped[str] = mapped_column(Text, default="")
    questionnaire_answers: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    custom_documents = relationship("CustomDocument", back_populates="project", cascade="all, delete-orphan")
    reporting_evidence = relationship("ReportingEvidence", back_populates="project", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="project", cascade="all, delete-orphan")
    integration = relationship("Integration", back_populates="project", uselist=False, cascade="all, delete-orphan")
