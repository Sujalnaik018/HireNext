"""Pydantic schemas for the User resource."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    role: str = "applicant"
    name: str
    email: EmailStr
    phone: str | None = None
    company: str | None = None
    location: str | None = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    role: str | None = None
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    company: str | None = None
    location: str | None = None


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
