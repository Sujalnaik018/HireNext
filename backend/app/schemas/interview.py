"""Pydantic schemas for the Interview resource."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InterviewBase(BaseModel):
    application_id: int
    interview_type: str = "Video"
    scheduled_at: datetime | None = None
    status: str = "Scheduled"


class InterviewCreate(InterviewBase):
    pass


class InterviewUpdate(BaseModel):
    interview_type: str | None = None
    scheduled_at: datetime | None = None
    status: str | None = None


class InterviewOut(InterviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
