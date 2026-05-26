"""Add milestone to github_tasks

Revision ID: b4e8f1a3c5d7
Revises: a3f7d9e2b1c4
Create Date: 2026-05-26
"""

import sqlalchemy as sa

from alembic import op

revision = "b4e8f1a3c5d7"
down_revision = "a3f7d9e2b1c4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("github_tasks", sa.Column("milestone", sa.String(255), nullable=True))


def downgrade() -> None:
    op.drop_column("github_tasks", "milestone")
