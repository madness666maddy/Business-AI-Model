from pydantic import BaseModel, Field


class SettingsUpdateRequest(BaseModel):
    businessName: str = Field(min_length=2, max_length=180)
    website: str = Field(min_length=3, max_length=500)
    fullName: str = Field(min_length=2, max_length=150)
    email: str = Field(min_length=5, max_length=255)
    timezone: str = Field(min_length=3, max_length=100)
    model: str = Field(min_length=3, max_length=120)
    notifications: bool = True
    reviewAlerts: bool = True
    competitorAlerts: bool = True
    weeklyReports: bool = True


