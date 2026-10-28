"""HireNext FastAPI application entry point."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.routes import applications, interviews, jobs, resumes, users

settings = get_settings()

API_PREFIX = "/api"

app = FastAPI(
    title="HireNext API",
    description="Backend for the HireNext job-applicant platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files so recruiters can view/download resumes.
UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.include_router(users.router, prefix=API_PREFIX)
app.include_router(jobs.router, prefix=API_PREFIX)
app.include_router(resumes.router, prefix=API_PREFIX)
app.include_router(applications.router, prefix=API_PREFIX)
app.include_router(interviews.router, prefix=API_PREFIX)


@app.get("/")
def root():
    return {"message": "HireNext API", "docs": "/docs"}


@app.get(f"{API_PREFIX}/health")
def health():
    return {"status": "ok"}