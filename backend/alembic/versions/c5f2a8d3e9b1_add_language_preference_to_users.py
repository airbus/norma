"""Add language_preference to users

Revision ID: c5f2a8d3e9b1
Revises: b4e8f1a3c5d7
Create Date: 2026-05-26
"""

import sqlalchemy as sa

from alembic import op

revision = "c5f2a8d3e9b1"
down_revision = "b4e8f1a3c5d7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("language_preference", sa.String(10), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "language_preference")
