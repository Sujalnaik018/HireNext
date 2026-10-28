"""Interview API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Interview
from app.schemas import InterviewCreate, InterviewOut, InterviewUpdate

router = APIRouter(prefix="/interviews", tags=["interviews"])


@router.get("/", response_model=list[InterviewOut])
def list_interviews(
    application_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Interview)
    if application_id is not None:
        query = query.filter(Interview.application_id == application_id)
    return query.order_by(Interview.scheduled_at.asc()).all()


@router.post("/", response_model=InterviewOut, status_code=status.HTTP_201_CREATED)
def create_interview(payload: InterviewCreate, db: Session = Depends(get_db)):
    interview = Interview(**payload.model_dump())
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.get("/{interview_id}", response_model=InterviewOut)
def get_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview


@router.patch("/{interview_id}", response_model=InterviewOut)
def update_interview(
    interview_id: int, payload: InterviewUpdate, db: Session = Depends(get_db)
):
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(interview, key, value)
    db.commit()
    db.refresh(interview)
    return interview


@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    db.delete(interview)
    db.commit()
