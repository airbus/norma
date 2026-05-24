import os

import vertexai

from app.core.config import settings


def init_llm_provider() -> None:
    model = settings.litellm_model
    if model.startswith("vertex_ai"):
        vertexai.Client(
            project=os.environ.get("VERTEXAI_PROJECT", ""),
            location=os.environ.get("VERTEXAI_LOCATION", ""),
        )
