from fastapi import APIRouter, Depends
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user, create_user_initials
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.settings import SettingsUpdateRequest


router = APIRouter(tags=["Settings"])


@router.post("/settings")
def save_settings(
    payload: SettingsUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    duplicate_email = (
        db.query(User)
        .filter(User.email == payload.email.lower(), User.id != current_user.id)
        .first()
    )

    if duplicate_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Another account already uses that email address.",
        )

    current_user.full_name = payload.fullName
    current_user.business_name = payload.businessName
    current_user.email = payload.email.lower()
    current_user.initials = create_user_initials(payload.fullName)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "message": "Settings updated successfully.",
        "user": current_user.to_payload(),
        "preferences": {
            "timezone": payload.timezone,
            "model": payload.model,
            "notifications": payload.notifications,
            "reviewAlerts": payload.reviewAlerts,
            "competitorAlerts": payload.competitorAlerts,
            "weeklyReports": payload.weeklyReports,
        },
    }
