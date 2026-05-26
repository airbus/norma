from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, chat, documents, frameworks, health, integrations, invites, projects, reporting, users
from app.core.config import settings
from app.core.database import SessionLocal
from app.services.seed import seed_frameworks


@asynccontextmanager
async def lifespan(_app: FastAPI):
    from app.core.llm import init_llm_provider

    init_llm_provider()
    db = SessionLocal()
    try:
        seed_frameworks(db)
    finally:
        db.close()
    yield


app = FastAPI(title=settings.project_name, debug=settings.debug, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(invites.router)
app.include_router(projects.router)
app.include_router(frameworks.router)
app.include_router(documents.router)
app.include_router(reporting.router)
app.include_router(integrations.router)
app.include_router(chat.router)
