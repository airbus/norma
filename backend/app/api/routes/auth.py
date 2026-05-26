from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.invite_token import InviteToken
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
    UserSelfUpdateRequest,
)
from app.services.seed import create_sample_project

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")

    user_count = db.query(User).count()
    invite = None

    if body.invite_token:
        invite = db.query(InviteToken).filter(InviteToken.token == body.invite_token).first()
        if not invite or invite.used_by or invite.expires_at < datetime.now():
            raise HTTPException(status_code=400, detail="Invalid or expired invite")
        if invite.email and invite.email.lower() != body.email.lower():
            raise HTTPException(status_code=400, detail="Email does not match invite")
    elif user_count > 0:
        raise HTTPException(status_code=403, detail="Registration requires an invite link")

    role = "admin" if user_count == 0 else (invite.role if invite else "member")

    user = User(
        email=body.email.lower(),
        hashed_password=hash_password(body.password),
        name=body.name,
        role=role,
    )
    db.add(user)

    if invite:
        invite.used_by = user.id
        invite.used_at = datetime.now(UTC)

    db.commit()
    db.refresh(user)

    create_sample_project(user.id, db)

    token = create_access_token(str(user.id), user.role)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower()).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    token = create_access_token(str(user.id), user.role)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_me(
    body: UserSelfUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the current user's preferences (e.g. language)."""
    if body.language_preference is not None:
        current_user.language_preference = body.language_preference
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/setup-status")
def setup_status(db: Session = Depends(get_db)):
    return {"needs_setup": db.query(User).count() == 0}
