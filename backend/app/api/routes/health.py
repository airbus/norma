from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def health_check():
    return {"status": "ok", "debug": settings.debug}
