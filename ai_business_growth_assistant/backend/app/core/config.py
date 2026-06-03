from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "AI Business Growth Assistant"
    environment: str = "development"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 120
    database_url: str = "sqlite:///./business_growth.db"
    postgres_database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/business_growth"
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-1.5-flash"
    chroma_persist_directory: str = "./chroma_data"
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://127.0.0.1:3000", "http://localhost:3000"]
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def active_database_url(self) -> str:
        if self.environment.lower() == "production" and self.postgres_database_url:
            return self.postgres_database_url
        return self.database_url


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

