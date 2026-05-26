import json
import logging
import re
import uuid

import litellm
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.llm import get_language_name, is_gemini_model
from app.models.custom_document import CustomDocument
from app.models.document import Document, DocumentDefinition
from app.models.framework import Framework
from app.models.project import Project
from app.models.reporting import ReportingEvidence
from app.models.user import User
from app.schemas.reporting import (
    EvidenceBulkUpsert,
    EvidenceResponse,
    SuggestRequest,
    SuggestResponse,
    ValidateRequest,
    ValidateResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/projects/{project_id}/reporting", tags=["reporting"])


def _get_project(project_id: uuid.UUID, user: User, db: Session) -> Project:
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("", response_model=list[EvidenceResponse])
def list_evidence(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    return db.query(ReportingEvidence).filter(ReportingEvidence.project_id == project.id).all()


@router.put("", response_model=list[EvidenceResponse])
def bulk_upsert_evidence(
    project_id: uuid.UUID,
    body: EvidenceBulkUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)

    for item in body.items:
        existing = (
            db.query(ReportingEvidence)
            .filter(ReportingEvidence.project_id == project.id, ReportingEvidence.item_key == item.item_key)
            .first()
        )
        if existing:
            existing.comment = item.comment
            existing.covered = item.covered
            existing.feedback = item.feedback
        else:
            db.add(
                ReportingEvidence(
                    project_id=project.id,
                    item_key=item.item_key,
                    comment=item.comment,
                    covered=item.covered,
                    feedback=item.feedback,
                )
            )

    db.commit()
    return db.query(ReportingEvidence).filter(ReportingEvidence.project_id == project.id).all()


def _language_rule(language: str | None) -> str:
    lang_name = get_language_name(language)
    if language and language != "en":
        return f"Respond entirely in {lang_name}."
    return "Use British English spelling (e.g., organisation, behaviour, summarisation)."


_SUGGEST_SYSTEM_TEMPLATE = """\
You are an AI compliance assistant helping users write evidence comments for regulatory, \
human rights, and environmental frameworks.

Output exactly ONE short sentence (max 40 words). No preamble, no labels, no bullet points.

- Be specific to the project's actual AI system, grounding in the provided context.
- {language_rule}
- If an existing comment is provided, improve it while keeping the user's intent.
"""


def _suggest_system_prompt(language: str | None) -> str:
    return _SUGGEST_SYSTEM_TEMPLATE.format(language_rule=_language_rule(language))


def _build_project_context(project: Project, db: Session, framework_id: str | None = None) -> list[str]:
    parts = [
        "## Project Overview\n",
        f"**Name:** {project.name}",
        f"**Risk Classification:** {project.risk_classification}",
    ]
    if project.description:
        parts.append(f"**Description:** {project.description}")
    if project.intended_purpose:
        parts.append(f"**Intended Purpose:** {project.intended_purpose}")
    if project.intended_users:
        parts.append(f"**Intended Users:** {project.intended_users}")
    if project.deployment_context:
        parts.append(f"**Deployment Context:** {project.deployment_context}")

    if project.questionnaire_answers:
        parts.append("\n## Self-Assessment Questionnaire Answers\n")
        for key, val in project.questionnaire_answers.items():
            if isinstance(val, list):
                val = ", ".join(val)
            parts.append(f"- {key}: {val}")

    doc_query = db.query(Document).filter(Document.project_id == project.id, Document.summary.isnot(None))
    if framework_id:
        doc_query = doc_query.join(DocumentDefinition).filter(DocumentDefinition.framework_id == framework_id)
    docs = doc_query.all()

    custom_docs = (
        db.query(CustomDocument)
        .filter(CustomDocument.project_id == project.id, CustomDocument.summary.isnot(None))
        .all()
    )
    if docs or custom_docs:
        parts.append("\n## Uploaded Document Summaries\n")
        for doc in docs:
            parts.append(f"**{doc.definition.name}:** {doc.summary}")
        for cdoc in custom_docs:
            parts.append(f"**{cdoc.file_name}:** {cdoc.summary}")

    evidence = db.query(ReportingEvidence).filter(ReportingEvidence.project_id == project.id).all()
    if evidence:
        parts.append("\n## Existing Reporting Evidence\n")
        for ev in evidence:
            parts.append(f"- {ev.item_key}: {ev.comment}")

    if framework_id:
        fw = db.query(Framework).filter(Framework.id == framework_id).first()
        if fw:
            parts.append(f"\n## Current Framework\n**{fw.name}:** {fw.description}")
    else:
        frameworks = db.query(Framework).all()
        if frameworks:
            parts.append("\n## Compliance Frameworks\n")
            for fw in frameworks:
                parts.append(f"**{fw.name}:** {fw.description}")

    return parts


def _build_suggest_prompt(
    question: str,
    project: Project,
    current_comment: str,
    db: Session,
    framework_id: str | None = None,
) -> str:
    parts = _build_project_context(project, db, framework_id)
    parts.append(f"\n## Compliance Question\n{question}")
    if current_comment.strip():
        parts.append(f"\n## Existing Comment to Improve\n{current_comment}")
    return "\n".join(parts)


def _build_validate_prompt(
    question: str,
    answer: str,
    project: Project,
    db: Session,
    framework_id: str | None = None,
) -> str:
    parts = _build_project_context(project, db, framework_id)
    parts.append(f"\n## Compliance Question\n{question}")
    parts.append(f"\n## User's Answer to Validate\n{answer}")
    return "\n".join(parts)


@router.post("/suggest", response_model=SuggestResponse)
async def suggest_comment(
    project_id: uuid.UUID,
    body: SuggestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    user_prompt = _build_suggest_prompt(
        body.question, project, body.current_comment, db, framework_id=body.framework_id or None
    )

    try:
        kwargs: dict = {}
        if is_gemini_model():
            kwargs["safety_settings"] = [
                {"category": cat, "threshold": "BLOCK_NONE"}
                for cat in [
                    "HARM_CATEGORY_HARASSMENT",
                    "HARM_CATEGORY_HATE_SPEECH",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "HARM_CATEGORY_DANGEROUS_CONTENT",
                ]
            ]
        response = await litellm.acompletion(
            model=settings.litellm_model,
            messages=[
                {"role": "system", "content": _suggest_system_prompt(current_user.language_preference)},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=2048,
            temperature=0.4,
            **kwargs,
        )
        finish_reason = response.choices[0].finish_reason
        content = response.choices[0].message.content
        print(f"[SUGGEST] finish_reason={finish_reason} len={len(content or '')} content={content!r}", flush=True)
        if not content:
            raise HTTPException(status_code=502, detail="LLM returned empty content")
        return SuggestResponse(suggestion=content.strip())
    except HTTPException:
        raise
    except Exception:
        logger.exception("Suggestion generation failed")
        raise HTTPException(status_code=502, detail="Failed to generate suggestion")


_VALIDATE_SYSTEM_TEMPLATE = """\
You are a strict AI compliance auditor. Your job is to determine whether an answer would \
satisfy a regulatory auditor reviewing this AI system for compliance.

Apply a high standard. Vague, generic, or aspirational statements are NOT acceptable. \
Answers must be concrete, specific to the project, and demonstrate actual implementation \
— not just intent. Phrases like "robust measures are in place" or "we ensure compliance" \
without specifics should be marked as insufficient.

Evaluate using the provided project context and documents.

Respond in exactly this JSON format (no other text):
{{"covered": true, "feedback": "..."}}

Rules:
- "covered": true ONLY if the answer provides concrete, verifiable evidence or specific \
measures that directly address every aspect of the question.
- "covered": false if the answer is vague, generic, lacks specifics, misses any aspect \
of the question, or would not withstand scrutiny from a compliance auditor.
- "feedback": One sentence (max 60 words). If covered, confirm what makes it sufficient. \
If not, be direct about exactly what is missing or too vague — name the specific gaps.
- {language_rule}
"""


def _validate_system_prompt(language: str | None) -> str:
    return _VALIDATE_SYSTEM_TEMPLATE.format(language_rule=_language_rule(language))


@router.post("/validate", response_model=ValidateResponse)
async def validate_answer(
    project_id: uuid.UUID,
    body: ValidateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    user_prompt = _build_validate_prompt(
        body.question, body.answer, project, db, framework_id=body.framework_id or None
    )

    try:
        safety_settings = [
            {"category": cat, "threshold": "BLOCK_NONE"}
            for cat in [
                "HARM_CATEGORY_HARASSMENT",
                "HARM_CATEGORY_HATE_SPEECH",
                "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "HARM_CATEGORY_DANGEROUS_CONTENT",
            ]
        ]
        response = await litellm.acompletion(
            model=settings.litellm_model,
            messages=[
                {"role": "system", "content": _validate_system_prompt(current_user.language_preference)},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=2048,
            temperature=0.2,
            safety_settings=safety_settings,
        )
        finish_reason = response.choices[0].finish_reason
        content = response.choices[0].message.content
        print(
            f"[VALIDATE] finish_reason={finish_reason} len={len(content or '')} content={content!r}",
            flush=True,
        )
        if not content:
            raise HTTPException(status_code=502, detail="LLM returned empty content")

        text = content.strip()
        if text.startswith("```"):
            text = "\n".join(text.split("\n")[1:])
            text = text.rsplit("```", 1)[0].strip()

        try:
            result = json.loads(text)
            return ValidateResponse(covered=result["covered"], feedback=result["feedback"])
        except (json.JSONDecodeError, KeyError):
            covered_match = re.search(r'"covered"\s*:\s*(true|false)', text, re.IGNORECASE)
            feedback_match = re.search(r'"feedback"\s*:\s*"((?:[^"\\]|\\.)*)', text)
            if covered_match and feedback_match:
                return ValidateResponse(
                    covered=covered_match.group(1).lower() == "true",
                    feedback=feedback_match.group(1).rstrip(),
                )
            logger.warning("Validation parse failed — raw: %r", content)
            return ValidateResponse(covered=False, feedback="Unable to validate this answer. Please review manually.")
    except HTTPException:
        raise
    except Exception:
        logger.exception("Validation failed")
        raise HTTPException(status_code=502, detail="Failed to validate answer")
