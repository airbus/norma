"""merge heads

Revision ID: 9f7c4f0444a8
Revises: b4e8f1a3c5d7, e4a1b7c9d3f2
Create Date: 2026-05-26 16:34:53.900308

"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "9f7c4f0444a8"
down_revision: str | None = ("b4e8f1a3c5d7", "e4a1b7c9d3f2")
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
