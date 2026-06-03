from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.analysis import CompetitorAnalysisRequest, OCRExtractResponse, WebsiteAnalysisRequest
from backend.app.services.analysis.analysis_orchestrator import orchestrator


router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/website")
def analyze_website(
    payload: WebsiteAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return orchestrator.analyze_website(
        payload.url,
        payload.businessName or current_user.business_name,
        ocr_text=payload.ocrText,
    )


@router.post("/reviews")
async def analyze_reviews(
    file: UploadFile | None = File(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file is None:
        return orchestrator.analyze_reviews(None)

    contents = await file.read()
    return orchestrator.analyze_reviews(contents)


@router.post("/ocr", response_model=OCRExtractResponse)
async def extract_ocr(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contents = await file.read()
    return orchestrator.extract_ocr_text(contents, file.filename)


@router.post("/competitors")
def analyze_competitors(
    payload: CompetitorAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return orchestrator.analyze_competitors(payload.urls)


@router.get("/swot")
def get_swot(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return orchestrator.get_swot()


@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return orchestrator.get_recommendations()


@router.get("/action-plan")
def get_action_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return orchestrator.get_action_plan()
