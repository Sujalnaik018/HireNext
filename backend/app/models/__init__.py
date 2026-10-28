"""SQLAlchemy ORM models.

Importing the model modules here ensures all mappings are registered
on the Base metadata so `Base.metadata.create_all` includes every table.
"""

from app.models.application import Application
from app.models.interview import Interview
from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User

__all__ = ["User", "Job", "Resume", "Application", "Interview"]
