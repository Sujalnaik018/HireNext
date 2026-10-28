"""Resume API routes."""

from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Resume
from app.schemas import ResumeCreate, ResumeOut, ResumeUpdate
from app.services.resume_parser import parse_resume


router = APIRouter(
    prefix="/resumes",
    tags=["resumes"],
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

UPLOAD_DIR = BASE_DIR / "uploads" / "resumes"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# HELPER - PARSE EXISTING RESUME
# ============================================================

def ensure_structured_data(
    resume: Resume,
    db: Session,
) -> Resume:
    """
    Make sure an existing resume has structured_data.

    Older resumes may have structured_data = NULL because
    they were uploaded before resume parsing was implemented.

    This function parses the stored PDF and saves the result.
    """

    # Already parsed
    if resume.structured_data:
        return resume

    # --------------------------------------------------------
    # Resolve stored file path
    # --------------------------------------------------------

    if not resume.file_path:
        return resume

    file_path = BASE_DIR / resume.file_path

    # --------------------------------------------------------
    # File does not exist
    # --------------------------------------------------------

    if not file_path.exists():
        return resume

    # --------------------------------------------------------
    # Parse the resume
    # --------------------------------------------------------

    try:
        structured_data = parse_resume(
            str(file_path)
        )

    except Exception:
        # Do not break the API if an old PDF cannot be parsed.
        return resume

    # --------------------------------------------------------
    # Save parsed data
    # --------------------------------------------------------

    if structured_data:
        resume.structured_data = structured_data

        db.add(resume)
        db.commit()
        db.refresh(resume)

    return resume


# ============================================================
# LIST RESUMES
# ============================================================

@router.get(
    "/",
    response_model=list[ResumeOut],
)
def list_resumes(
    user_id: int | None = None,
    db: Session = Depends(get_db),
):
    """
    List resumes.

    If an older resume has structured_data = NULL,
    automatically parse the PDF before returning it.
    """

    query = db.query(Resume)

    if user_id is not None:
        query = query.filter(
            Resume.user_id == user_id
        )

    resumes = (
        query
        .order_by(Resume.created_at.desc())
        .all()
    )

    # --------------------------------------------------------
    # Repair old resumes that have no structured_data
    # --------------------------------------------------------

    changed = False

    for resume in resumes:

        if not resume.structured_data:

            if not resume.file_path:
                continue

            file_path = BASE_DIR / resume.file_path

            if not file_path.exists():
                continue

            try:
                structured_data = parse_resume(
                    str(file_path)
                )

                if structured_data:
                    resume.structured_data = structured_data
                    changed = True

            except Exception:
                # Keep the resume available even if parsing fails.
                continue

    # Save all repaired resumes in one transaction
    if changed:
        db.commit()

        for resume in resumes:
            db.refresh(resume)

    return resumes


# ============================================================
# UPLOAD RESUME PDF
# ============================================================

@router.post(
    "/upload",
    response_model=ResumeOut,
    status_code=status.HTTP_201_CREATED,
)
async def upload_resume(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    template_name: str | None = Form(None),
    completion: int | None = Form(None),
    ats_score: int | None = Form(None),
    db: Session = Depends(get_db),
):
    """
    Upload a PDF resume, extract its text,
    parse the resume and store structured_data.
    """

    # --------------------------------------------------------
    # Validate file
    # --------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file was provided.",
        )

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported.",
        )

    # --------------------------------------------------------
    # Make a safe filename
    # --------------------------------------------------------

    original_name = Path(
        file.filename
    ).name

    safe_filename = (
        original_name
        .replace(" ", "_")
        .replace("/", "_")
        .replace("\\", "_")
    )

    file_path = UPLOAD_DIR / safe_filename

    # --------------------------------------------------------
    # Avoid overwriting an existing file
    # --------------------------------------------------------

    if file_path.exists():

        stem = file_path.stem
        suffix = file_path.suffix

        counter = 1

        while file_path.exists():

            file_path = (
                UPLOAD_DIR
                / f"{stem}_{counter}{suffix}"
            )

            counter += 1

    # --------------------------------------------------------
    # Save PDF
    # --------------------------------------------------------

    file_contents = await file.read()

    if not file_contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded PDF is empty.",
        )

    file_path.write_bytes(
        file_contents
    )

    # --------------------------------------------------------
    # Parse resume
    # --------------------------------------------------------

    try:

        structured_data = parse_resume(
            str(file_path)
        )

        # Make sure parsing actually returned something.
        if not structured_data:
            raise ValueError(
                "Resume parser returned empty structured_data."
            )

    except Exception as error:

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=422,
            detail=(
                "Unable to parse the resume PDF: "
                f"{str(error)}"
            ),
        ) from error

    # --------------------------------------------------------
    # Create database record
    # --------------------------------------------------------

    resume = Resume(
        user_id=user_id,
        file_name=original_name,
        file_path=str(
            file_path.relative_to(BASE_DIR)
        ),
        file_size=len(file_contents),
        template_name=template_name,
        completion=completion,
        ats_score=ats_score,
        structured_data=structured_data,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume


# ============================================================
# CREATE RESUME
# ============================================================

@router.post(
    "/",
    response_model=ResumeOut,
    status_code=status.HTTP_201_CREATED,
)
def create_resume(
    payload: ResumeCreate,
    db: Session = Depends(get_db),
):
    resume = Resume(
        **payload.model_dump()
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume


# ============================================================
# GET SINGLE RESUME
# ============================================================

@router.get(
    "/{resume_id}",
    response_model=ResumeOut,
)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a single resume.

    Automatically parses the PDF if structured_data is NULL.
    """

    resume = db.get(
        Resume,
        resume_id,
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    # --------------------------------------------------------
    # IMPORTANT:
    # Repair old resume records where structured_data is NULL
    # --------------------------------------------------------

    resume = ensure_structured_data(
        resume,
        db,
    )

    return resume


# ============================================================
# UPDATE RESUME
# ============================================================

@router.patch(
    "/{resume_id}",
    response_model=ResumeOut,
)
def update_resume(
    resume_id: int,
    payload: ResumeUpdate,
    db: Session = Depends(get_db),
):
    resume = db.get(
        Resume,
        resume_id,
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():

        setattr(
            resume,
            key,
            value,
        )

    db.commit()
    db.refresh(resume)

    return resume


# ============================================================
# DELETE RESUME
# ============================================================

@router.delete(
    "/{resume_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
):
    resume = db.get(
        Resume,
        resume_id,
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    db.delete(resume)
    db.commit()

    return None