import os

import vertexai

from app.core.config import settings

LANGUAGE_NAMES: dict[str, str] = {
    "en": "British English",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
}


def get_language_name(code: str | None) -> str:
    return LANGUAGE_NAMES.get(code or "en", "British English")


def language_rule(language: str | None) -> str:
    lang_name = get_language_name(language)
    if language and language != "en":
        return f"Respond entirely in {lang_name}."
    return "Use British English spelling (e.g., organisation, behaviour, summarisation)."


def init_llm_provider() -> None:
    model = settings.litellm_model
    if model.startswith("vertex_ai"):
        vertexai.Client(
            project=os.environ.get("VERTEXAI_PROJECT", ""),
            location=os.environ.get("VERTEXAI_LOCATION", ""),
        )
