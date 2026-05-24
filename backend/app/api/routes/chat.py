import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part
from sqlalchemy.orm import Session

from app.agents.norma import build_system_prompt, create_norma_agent
from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.chat import ChatMessage, ChatSession
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

    agent = create_norma_agent(session.system_prompt)
    session_service = InMemorySessionService()

    adk_session = await session_service.create_session(
        app_name="norma",
        user_id=str(current_user.id),
    )

    history = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.created_at).all()
    for msg in history[:-1]:
        author = msg.role if msg.role == "user" else "norma"
        event = type("Event", (), {"author": author, "content": Content(parts=[Part(text=msg.content)])})()
        adk_session.events.append(event)

    runner = Runner(agent=agent, app_name="norma", session_service=session_service)

    user_content = Content(parts=[Part(text=body.content)])

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

    agent = create_norma_agent(session.system_prompt)
    session_service = InMemorySessionService()

    adk_session = await session_service.create_session(
        app_name="norma",
        user_id=str(current_user.id),
    )

    runner = Runner(agent=agent, app_name="norma", session_service=session_service)
    user_content = Content(parts=[Part(text=body.content)])

    async def event_generator():
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
                        yield f"data: {part.text}\n\n"

        assistant_msg = ChatMessage(session_id=session.id, role="assistant", content=response_text)
        db.add(assistant_msg)
        db.commit()
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
