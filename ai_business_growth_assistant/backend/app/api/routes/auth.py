from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_user_initials,
    hash_password,
    get_current_user,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, UserCreate, UserLogin


router = APIRouter(prefix="/auth", tags=["Auth"])


def build_auth_response(user: User) -> dict:
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return {"access_token": token, "token_type": "bearer", "user": user.to_payload()}


@router.post("/register", response_model=AuthResponse)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account already exists for this email.")

    user = User(
        full_name=payload.fullName,
        business_name=payload.businessName,
        email=email,
        hashed_password=hash_password(payload.password),
        role="Business Owner",
        initials=create_user_initials(payload.fullName),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return build_auth_response(user)


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()

    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    return build_auth_response(user)


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return current_user.to_payload()

