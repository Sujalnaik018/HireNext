"""Application configuration loaded from environment variables.

Credentials and connection strings are read from the environment / .env file.
They are never exposed through API responses.
"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory of the backend project (backend/).
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Centralized settings for the HireNext backend."""

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # PostgreSQL connection string. Never returned to clients.
    # Uses the psycopg (v3) driver dialect `postgresql+psycopg`.
    DATABASE_URL: str = (
        "postgresql+psycopg://postgres:password@localhost:5432/hirenext"
    )

    # Comma-separated list of allowed CORS origins for the frontend.
    # Defaults to the standard Vite dev server and the configured port 5176.
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5176"

    # Directory where uploaded resume PDFs are stored locally.
    UPLOAD_DIR: str = "uploads"

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse the comma-separated CORS origins into a list."""
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def upload_dir_path(self) -> Path:
        """Absolute path to the upload directory (created on demand)."""
        path = Path(self.UPLOAD_DIR)
        if not path.is_absolute():
            path = BASE_DIR / path
        return path


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()
