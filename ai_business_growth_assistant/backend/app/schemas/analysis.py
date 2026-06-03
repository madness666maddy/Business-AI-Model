from pydantic import BaseModel, Field, field_validator


def normalize_url(value: str) -> str:
    text = value.strip()
    if not text:
        return text
    if "://" not in text:
        return f"https://{text}"
    return text


class WebsiteAnalysisRequest(BaseModel):
    url: str = Field(min_length=3)
    businessName: str | None = Field(default=None, max_length=180)

    @field_validator("url")
    @classmethod
    def clean_url(cls, value: str) -> str:
        return normalize_url(value)


class CompetitorAnalysisRequest(BaseModel):
    urls: list[str] = Field(default_factory=list)

    @field_validator("urls", mode="before")
    @classmethod
    def clean_urls(cls, value):
        if value is None:
            return []
        if isinstance(value, str):
            return [normalize_url(value)]
        return [normalize_url(url) for url in value if str(url).strip()]


class ChatMessageRequest(BaseModel):
    threadId: int = Field(ge=1)
    message: str = Field(min_length=1, max_length=5000)


