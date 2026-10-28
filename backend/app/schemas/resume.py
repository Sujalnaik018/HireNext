"""Pydantic schemas for the Resume resource."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class ResumeBase(BaseModel):
    user_id: int
    file_name: str
    template_name: str | None = None
    completion: int | None = None
    ats_score: int | None = None


class ResumeCreate(ResumeBase):
    file_path: str
    file_size: int | None = None


class ResumeUpdate(BaseModel):
    template_name: str | None = None
    completion: int | None = None
    ats_score: int | None = None
    structured_data: dict[str, Any] | None = None


class ResumeOut(ResumeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    file_path: str
    file_size: int | None = None
    structured_data: dict[str, Any] | None = None
    created_at: datetime
    updated_at: datetime
