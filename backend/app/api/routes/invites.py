import secrets
import uuid
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.core.database import get_db
from app.models.invite_token import InviteToken
from app.models.user import User
from app.schemas.invite import InviteCreateRequest, InviteResponse

router = APIRouter(prefix="/api/invites", tags=["invites"])


@router.post("", response_model=InviteResponse)
def create_invite(
    body: InviteCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    invite = InviteToken(
        token=secrets.token_urlsafe(32),
        email=body.email,
        role=body.role,
        created_by=current_user.id,
        expires_at=datetime.now(UTC) + timedelta(days=7),
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)
    return invite


@router.get("", response_model=list[InviteResponse])
def list_invites(
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    return db.query(InviteToken).order_by(InviteToken.created_at.desc()).all()


@router.delete("/{invite_id}")
def delete_invite(
    invite_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_user: User = Depends(require_admin),
):
    invite = db.query(InviteToken).filter(InviteToken.id == invite_id).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    if invite.used_by:
        raise HTTPException(status_code=400, detail="Cannot delete a used invite")

    db.delete(invite)
    db.commit()
    return {"detail": "Invite deleted"}


@router.get("/{token}/validate")
def validate_invite(token: str, db: Session = Depends(get_db)):
    invite = db.query(InviteToken).filter(InviteToken.token == token).first()
    if not invite or invite.used_by or invite.expires_at < datetime.now(UTC):
        return {"valid": False}
    return {"valid": True, "email": invite.email, "role": invite.role}
