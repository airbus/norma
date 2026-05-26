"""Add validation fields to reporting_evidence

Revision ID: e4a1b7c9d3f2
Revises: c7a9e3f1b2d6
Create Date: 2026-05-26
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "e4a1b7c9d3f2"
down_revision: str | None = "c7a9e3f1b2d6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("reporting_evidence", sa.Column("covered", sa.Boolean(), nullable=True))
    op.add_column("reporting_evidence", sa.Column("feedback", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("reporting_evidence", "feedback")
    op.drop_column("reporting_evidence", "covered")
