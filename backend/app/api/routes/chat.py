from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.chat import ChatEmailSummaryRequest, ChatEmailSummaryResponse, ChatMessageResponse
from backend.app.schemas.analysis import ChatMessageRequest
from backend.app.services.analysis.analysis_orchestrator import orchestrator


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/message", response_model=ChatMessageResponse)
def message(
    payload: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return orchestrator.handle_chat(payload.threadId, payload.message, user=current_user)


@router.post("/email-summary", response_model=ChatEmailSummaryResponse)
def email_summary(
    payload: ChatEmailSummaryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return orchestrator.send_chat_summary(payload.threadId, user=current_user)
