from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.analysis.analysis_orchestrator import orchestrator


router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/pdf")
def download_pdf(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pdf_bytes = orchestrator.build_pdf_report(current_user)
    safe_name = "".join(character for character in current_user.business_name.lower() if character.isalnum() or character == "-")
    filename = f"ai-business-growth-assistant-{safe_name or 'report'}.pdf"
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
