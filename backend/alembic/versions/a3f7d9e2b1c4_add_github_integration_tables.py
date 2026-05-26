"""Add GitHub integration tables

Revision ID: a3f7d9e2b1c4
Revises: c7a9e3f1b2d6
Create Date: 2026-05-26
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "a3f7d9e2b1c4"
down_revision = "c7a9e3f1b2d6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "integrations",
        sa.Column("id", sa.Uuid(), nullable=False, default=sa.text("gen_random_uuid()")),
        sa.Column("project_id", sa.Uuid(), sa.ForeignKey("projects.id"), nullable=False, unique=True),
        sa.Column("provider", sa.String(50), nullable=False, server_default="github"),
        sa.Column("github_pat", sa.String(500), nullable=False),
        sa.Column("repo_owner", sa.String(255), nullable=False),
        sa.Column("repo_name", sa.String(255), nullable=False),
        sa.Column("github_project_number", sa.Integer(), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("architecture_mermaid", sa.Text(), nullable=True),
        sa.Column("sync_status", sa.String(50), nullable=False, server_default="idle"),
        sa.Column("last_synced_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "github_tasks",
        sa.Column("id", sa.Uuid(), nullable=False, default=sa.text("gen_random_uuid()")),
        sa.Column("integration_id", sa.Uuid(), sa.ForeignKey("integrations.id"), nullable=False),
        sa.Column("github_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("body", sa.Text(), nullable=True),
        sa.Column("status", sa.String(50), nullable=False),
        sa.Column("assignees", postgresql.JSONB(), nullable=True),
        sa.Column("labels", postgresql.JSONB(), nullable=True),
        sa.Column("github_url", sa.String(500), nullable=False),
        sa.Column("github_created_at", sa.DateTime(), nullable=True),
        sa.Column("github_updated_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("integration_id", "github_id"),
    )

    op.create_table(
        "github_repo_files",
        sa.Column("id", sa.Uuid(), nullable=False, default=sa.text("gen_random_uuid()")),
        sa.Column("integration_id", sa.Uuid(), sa.ForeignKey("integrations.id"), nullable=False),
        sa.Column("file_path", sa.String(500), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("integration_id", "file_path"),
    )


def downgrade() -> None:
    op.drop_table("github_repo_files")
    op.drop_table("github_tasks")
    op.drop_table("integrations")
