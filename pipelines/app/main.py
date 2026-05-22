from fastapi import FastAPI

from app.api.routes import health
from app.core.config import settings

app = FastAPI(title=settings.project_name, debug=settings.debug)

app.include_router(health.router)
