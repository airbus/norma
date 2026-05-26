from fastapi import FastAPI

from app.api.routes import documents, github, health
from app.core.config import settings
from app.core.llm import init_llm_provider

init_llm_provider()

app = FastAPI(title=settings.project_name, debug=settings.debug)

app.include_router(health.router)
app.include_router(documents.router)
app.include_router(github.router)
