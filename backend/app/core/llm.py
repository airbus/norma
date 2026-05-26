import os

import vertexai

from app.core.config import settings

_GEMINI_PREFIXES = ("gemini", "vertex_ai/", "vertex_ai_beta/")

LANGUAGE_NAMES: dict[str, str] = {
    "en": "British English",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
}


def get_language_name(code: str | None) -> str:
    return LANGUAGE_NAMES.get(code or "en", "British English")


def is_gemini_model() -> bool:
    return settings.litellm_model.lower().startswith(_GEMINI_PREFIXES)


def init_llm_provider() -> None:
    model = settings.litellm_model
    if model.startswith("vertex_ai"):
        vertexai.Client(
            project=os.environ.get("VERTEXAI_PROJECT", ""),
            location=os.environ.get("VERTEXAI_LOCATION", ""),
        )
