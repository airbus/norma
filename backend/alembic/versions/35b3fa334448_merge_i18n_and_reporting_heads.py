"""merge i18n and reporting heads

Revision ID: 35b3fa334448
Revises: 9f7c4f0444a8, c5f2a8d3e9b1
Create Date: 2026-05-26 18:03:14.307430

"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "35b3fa334448"
down_revision: str | None = ("9f7c4f0444a8", "c5f2a8d3e9b1")
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
