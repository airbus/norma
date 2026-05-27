import sqlite3
import uuid

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import JSON, Uuid, create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.routes import auth, documents, frameworks, health, integrations, invites, projects, reporting, users
from app.core.database import Base, get_db

# --- SQLite compatibility patches ---

# 1. Teach sqlite3 to handle UUID objects
sqlite3.register_adapter(uuid.UUID, str)

# 2. Remap JSONB columns to plain JSON in metadata
for table in Base.metadata.tables.values():
    for col in table.columns:
        if type(col.type).__name__ == "JSONB":
            col.type = JSON()

# 3. Patch Uuid bind processor to accept strings (SQLite doesn't auto-cast like PostgreSQL)
_original_uuid_bind = Uuid.bind_processor


def _patched_uuid_bind(self, dialect):
    processor = _original_uuid_bind(self, dialect)
    if processor is None:
        return None

    def process(value):
        if value is None:
            return None
        if isinstance(value, str):
            value = uuid.UUID(value)
        return processor(value)

    return process


Uuid.bind_processor = _patched_uuid_bind

# --- Test database setup ---

engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, _connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


TestingSessionLocal = sessionmaker(bind=engine)


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def _create_test_app() -> FastAPI:
    app = FastAPI()
    app.dependency_overrides[get_db] = _override_get_db
    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(invites.router)
    app.include_router(projects.router)
    app.include_router(frameworks.router)
    app.include_router(documents.router)
    app.include_router(reporting.router)
    app.include_router(integrations.router)
    return app


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    app = _create_test_app()
    with TestClient(app) as c:
        yield c


@pytest.fixture
def auth_header(client):
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "testpassword123", "name": "Test User"},
    )
    resp = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "testpassword123"},
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
