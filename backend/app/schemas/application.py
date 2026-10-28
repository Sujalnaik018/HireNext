"""Pydantic schemas for the Application resource."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ApplicationBase(BaseModel):
    user_id: int
    job_id: int
    resume_id: int | None = None
    status: str = "Applied"
    match_score: int | None = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    status: str | None = None
    match_score: int | None = None
    resume_id: int | None = None


class ApplicationOut(ApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
