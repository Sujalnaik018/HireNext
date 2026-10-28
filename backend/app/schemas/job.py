"""Pydantic schemas for the Job resource."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class JobBase(BaseModel):
    title: str
    company: str
    location: str | None = None
    employment_type: str | None = None
    experience: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    description: str | None = None
    skills: str | None = None
    status: str = "active"


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: str | None = None
    company: str | None = None
    location: str | None = None
    employment_type: str | None = None
    experience: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    description: str | None = None
    skills: str | None = None
    status: str | None = None


class JobOut(JobBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
