import logging
from pathlib import Path

import litellm

from app.core.config import settings
from app.core.llm import language_rule

logger = logging.getLogger(__name__)

SUMMARY_PROMPT = """\
You are a document analysis assistant. Below is the full text extracted from a compliance document. \
Create a comprehensive markdown summary that captures all key information, requirements, obligations, \
and important details from this document. The summary should be detailed enough that someone reading \
only this summary would understand the document's full scope and requirements.

Structure the summary with:
- A brief overview paragraph
- Key sections with their main points
- Specific requirements, obligations, or action items
- Any deadlines, thresholds, or quantitative criteria mentioned

{language_rule}

Document text:
---
{text}
---

Provide the comprehensive markdown summary:
"""


def extract_text(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        import fitz

        doc = fitz.open(str(path))
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text

    if suffix in {".md", ".txt", ".csv", ".json", ".xml", ".html"}:
        return path.read_text(encoding="utf-8", errors="replace")

    return path.read_text(encoding="utf-8", errors="replace")


async def generate_summary(text: str, language: str = "en") -> str:
    if not text.strip():
        return "No content could be extracted from this document."

    max_chars = 100_000
    if len(text) > max_chars:
        text = text[:max_chars] + "\n\n[... document truncated for processing ...]"

    response = await litellm.acompletion(
        model=settings.litellm_model,
        messages=[{"role": "user", "content": SUMMARY_PROMPT.format(text=text, language_rule=language_rule(language))}],
        max_tokens=4096,
    )

    return response.choices[0].message.content or "Summary generation failed."


async def process_document(file_path: str, language: str = "en") -> str:
    logger.info("Processing document: %s", file_path)
    text = extract_text(file_path)
    summary = await generate_summary(text, language=language)
    logger.info("Generated summary for: %s (%d chars)", file_path, len(summary))
    return summary
