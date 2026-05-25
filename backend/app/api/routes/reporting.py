import logging
import uuid

import litellm
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.custom_document import CustomDocument
from app.models.document import Document
from app.models.framework import Framework
from app.models.project import Project
from app.models.reporting import ReportingEvidence
from app.models.user import User
from app.schemas.reporting import (
    EvidenceBulkUpsert,
    EvidenceResponse,
    SuggestRequest,
    SuggestResponse,
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
        else:
            db.add(ReportingEvidence(project_id=project.id, item_key=item.item_key, comment=item.comment))

    db.commit()
    return db.query(ReportingEvidence).filter(ReportingEvidence.project_id == project.id).all()


SUGGEST_SYSTEM_PROMPT = """\
You are an EU AI Act compliance assistant helping users write evidence comments.

Output exactly ONE short sentence (max 40 words). No preamble, no labels, no bullet points.

- Be specific to the project's actual AI system, grounding in the provided context.
- Use British English spelling (e.g., organisation, behaviour, summarisation).
- If an existing comment is provided, improve it while keeping the user's intent.
"""


def _build_suggest_prompt(question: str, project: Project, current_comment: str, db: Session) -> str:
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

    docs = db.query(Document).filter(Document.project_id == project.id, Document.summary.isnot(None)).all()
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

    frameworks = db.query(Framework).all()
    if frameworks:
        parts.append("\n## Compliance Frameworks\n")
        for fw in frameworks:
            parts.append(f"**{fw.name}:** {fw.description}")

    parts.append(f"\n## Compliance Question\n{question}")

    if current_comment.strip():
        parts.append(f"\n## Existing Comment to Improve\n{current_comment}")

    return "\n".join(parts)


@router.post("/suggest", response_model=SuggestResponse)
async def suggest_comment(
    project_id: uuid.UUID,
    body: SuggestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_project(project_id, current_user, db)
    user_prompt = _build_suggest_prompt(body.question, project, body.current_comment, db)

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
                {"role": "system", "content": SUGGEST_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=2048,
            temperature=0.4,
            safety_settings=safety_settings,
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
