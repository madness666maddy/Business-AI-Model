from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.analysis.analysis_orchestrator import orchestrator


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def overview(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return orchestrator.build_dashboard_overview(current_user)

