import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.routes import health


def _create_test_app() -> FastAPI:
    app = FastAPI()
    app.include_router(health.router)
    return app


@pytest.fixture
def client():
    app = _create_test_app()
    with TestClient(app) as c:
        yield c
