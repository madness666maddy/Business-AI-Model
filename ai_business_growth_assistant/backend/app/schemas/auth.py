from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    fullName: str = Field(min_length=2, max_length=150)
    businessName: str = Field(min_length=2, max_length=180)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


