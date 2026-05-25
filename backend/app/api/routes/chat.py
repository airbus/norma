import json
import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.adk.events import Event
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part
from sqlalchemy.orm import Session

from app.agents.norma import build_system_prompt, create_norma_agent
from app.api.dependencies import get_current_user
from app.core.database import SessionLocal, get_db
from app.models.chat import ChatMessage, ChatSession
from app.models.custom_document import CustomDocument
from app.models.document import Document
from app.models.framework import Framework
from app.models.project import Project
from app.models.reporting import ReportingEvidence
from app.models.user import User
from app.schemas.chat import (
    ChatMessageResponse,
    ChatSendMessage,
    ChatSessionCreate,
    ChatSessionDetail,
    ChatSessionResponse,
)

router = APIRouter(prefix="/api/chat", tags=["chat"])

_adk_session_service = InMemorySessionService()


async def _get_or_create_adk_session(
    chat_session_id: uuid.UUID,
    user_id: str,
    past_messages: list[ChatMessage],
):
    """Get existing ADK session or create one, replaying DB history if new."""
    adk_session_id = str(chat_session_id)

    adk_session = await _adk_session_service.get_session(
        app_name="norma",
        user_id=user_id,
        session_id=adk_session_id,
    )
    if adk_session:
        return adk_session

    adk_session = await _adk_session_service.create_session(
        app_name="norma",
        user_id=user_id,
        session_id=adk_session_id,
    )

    for msg in past_messages:
        author = "user" if msg.role == "user" else "norma"
        role = "user" if msg.role == "user" else "model"
        event = Event(
            invocation_id=str(msg.id),
            author=author,
            content=Content(role=role, parts=[Part(text=msg.content)]),
        )
        await _adk_session_service.append_event(session=adk_session, event=event)

    return adk_session


def _assemble_context(project: Project, db: Session) -> str:
    frameworks = db.query(Framework).all()
    framework_contents = [{"name": fw.name, "description": fw.description, "content": fw.content} for fw in frameworks]

    project_context = {
        "name": project.name,
        "description": project.description,
        "risk_classification": project.risk_classification,
        "intended_purpose": project.intended_purpose,
        "intended_users": project.intended_users,
        "deployment_context": project.deployment_context,
        "questionnaire_answers": project.questionnaire_answers,
    }

    evidence = db.query(ReportingEvidence).filter(ReportingEvidence.project_id == project.id).all()
    if evidence:
        project_context["reporting_evidence"] = [{"item_key": e.item_key, "comment": e.comment} for e in evidence]

    docs = db.query(Document).filter(Document.project_id == project.id, Document.summary.isnot(None)).all()
    document_summaries = [{"name": doc.definition.name, "summary": doc.summary} for doc in docs]

    custom_docs = (
        db.query(CustomDocument)
        .filter(CustomDocument.project_id == project.id, CustomDocument.summary.isnot(None))
        .all()
    )
    for cdoc in custom_docs:
        document_summaries.append({"name": cdoc.file_name, "summary": cdoc.summary})

    return build_system_prompt(
        framework_contents=framework_contents,
        project_context=project_context,
        document_summaries=document_summaries if document_summaries else None,
    )


@router.post("/sessions", response_model=ChatSessionResponse, status_code=201)
def create_session(
    body: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == body.project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    system_prompt = _assemble_context(project, db)
    session = ChatSession(project_id=project.id, user_id=current_user.id, system_prompt=system_prompt)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions", response_model=list[ChatSessionResponse])
def list_sessions(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ChatSession)
        .filter(ChatSession.project_id == project_id, ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
        .all()
    )


@router.get("/sessions/{session_id}", response_model=ChatSessionDetail)
def get_session(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
async def send_message(
    session_id: uuid.UUID,
    body: ChatSendMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    user_msg = ChatMessage(session_id=session.id, role="user", content=body.content)
    db.add(user_msg)
    db.commit()

    history = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.created_at).all()
    past_messages = history[:-1]

    adk_session = await _get_or_create_adk_session(
        chat_session_id=session.id,
        user_id=str(current_user.id),
        past_messages=past_messages,
    )

    agent = create_norma_agent(session.system_prompt)
    runner = Runner(agent=agent, app_name="norma", session_service=_adk_session_service)
    user_content = Content(role="user", parts=[Part(text=body.content)])

    response_text = ""
    async for event in runner.run_async(
        user_id=str(current_user.id),
        session_id=adk_session.id,
        new_message=user_content,
    ):
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    response_text += part.text

    if not response_text:
        response_text = "I'm sorry, I couldn't generate a response. Please try again."

    assistant_msg = ChatMessage(session_id=session.id, role="assistant", content=response_text)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    return assistant_msg


@router.post("/sessions/{session_id}/messages/stream")
async def send_message_stream(
    session_id: uuid.UUID,
    body: ChatSendMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    user_msg = ChatMessage(session_id=session.id, role="user", content=body.content)
    db.add(user_msg)
    db.commit()

    history = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.created_at).all()
    past_messages = history[:-1]

    adk_session = await _get_or_create_adk_session(
        chat_session_id=session.id,
        user_id=str(current_user.id),
        past_messages=past_messages,
    )

    agent = create_norma_agent(session.system_prompt)
    runner = Runner(agent=agent, app_name="norma", session_service=_adk_session_service)
    user_content = Content(role="user", parts=[Part(text=body.content)])

    run_config = RunConfig(streaming_mode=StreamingMode.SSE)

    chat_session_id = session.id
    user_id = str(current_user.id)

    async def event_generator():
        response_text = ""
        event_count = 0
        async for event in runner.run_async(
            user_id=user_id,
            session_id=adk_session.id,
            new_message=user_content,
            run_config=run_config,
        ):
            event_count += 1
            has_content = bool(event.content and event.content.parts)
            print(
                f"[STREAM] event#{event_count} partial={event.partial} author={event.author} has_content={has_content}",
                flush=True,
            )
            if not event.partial or not event.content or not event.content.parts:
                continue
            for part in event.content.parts:
                if part.text and not part.function_call:
                    response_text += part.text
                    yield f"data: {json.dumps(part.text)}\n\n"

        gen_db = SessionLocal()
        try:
            assistant_msg = ChatMessage(session_id=chat_session_id, role="assistant", content=response_text)
            gen_db.add(assistant_msg)
            gen_db.commit()
        finally:
            gen_db.close()
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"},
    )
