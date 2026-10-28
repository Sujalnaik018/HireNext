"""Resume model — stores uploaded/stored resume metadata.

`structured_data` is a JSONB column intended to hold parsed resume content
(contact info, sections, skills, etc.) once the AI parsing pipeline is added.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Resume(Base):
    """A candidate's resume."""

    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    file_name: Mapped[str] = mapped_column(String(255))
    file_path: Mapped[str] = mapped_column(String(500))
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    template_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    completion: Mapped[int | None] = mapped_column(Integer, nullable=True)
    ats_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    structured_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["User"] = relationship(back_populates="resumes")  # type: ignore[name-defined]
