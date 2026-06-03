from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.chat import ChatMessageResponse
from app.schemas.analysis import ChatMessageRequest
from app.services.analysis.analysis_orchestrator import orchestrator


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/message", response_model=ChatMessageResponse)
def message(
    payload: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return orchestrator.handle_chat(payload.threadId, payload.message)

