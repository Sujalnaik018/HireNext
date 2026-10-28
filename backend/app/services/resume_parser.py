"""
Resume PDF parser.

Extracts text from a PDF and attempts to identify:
- Name
- Email
- Phone
- Skills
- Experience
- Education
- Projects
- Certificates
"""

import re
from pathlib import Path

from pypdf import PdfReader


# Common skills for the first version of HireNext.
# We can expand this later or replace it with an NLP/AI model.
KNOWN_SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "sql",
    "html",
    "css",
    "react",
    "react.js",
    "node.js",
    "node",
    "express",
    "fastapi",
    "django",
    "flask",
    "postgresql",
    "mysql",
    "mongodb",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data science",
    "data analysis",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "nlp",
    "natural language processing",
    "power bi",
    "tableau",
    "hadoop",
    "spark",
}


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from all pages of a PDF.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Resume file not found: {file_path}"
        )

    reader = PdfReader(str(path))

    pages = []

    for page in reader.pages:
        text = page.extract_text() or ""

        if text.strip():
            pages.append(text)

    return "\n".join(pages).strip()


def extract_email(text: str) -> str | None:
    """Extract the first email address."""

    match = re.search(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        text,
    )

    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    """Extract a likely phone number."""

    match = re.search(
        r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)",
        text,
    )

    if match:
        return match.group(0)

    # Fallback for common international/general formats.
    match = re.search(
        r"(?<!\d)(?:\+\d{1,3}[\s-]?)?\d{10}(?!\d)",
        text,
    )

    return match.group(0) if match else None


def extract_name(text: str) -> str | None:
    """
    Try to extract the candidate's name.

    Usually the name appears near the beginning of the resume.
    """

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return None

    ignored = {
        "resume",
        "curriculum vitae",
        "cv",
        "profile",
        "objective",
        "summary",
        "contact",
        "personal information",
    }

    email = extract_email(text)

    for line in lines[:15]:
        cleaned = line.strip()

        if cleaned.lower() in ignored:
            continue

        if email and email.lower() in cleaned.lower():
            continue

        if any(char.isdigit() for char in cleaned):
            continue

        words = cleaned.split()

        if 2 <= len(words) <= 5:
            if all(
                re.match(r"^[A-Za-z][A-Za-z.'-]*$", word)
                for word in words
            ):
                return cleaned

    return None


def extract_skills(text: str) -> list[str]:
    """Find known skills mentioned in the resume."""

    text_lower = text.lower()

    found = []

    # Longer phrases first to avoid partial duplicates.
    for skill in sorted(
        KNOWN_SKILLS,
        key=len,
        reverse=True,
    ):
        pattern = rf"(?<![a-z0-9]){re.escape(skill.lower())}(?![a-z0-9])"

        if re.search(pattern, text_lower):
            found.append(skill)

    return sorted(set(found))


def extract_section(
    text: str,
    section_names: list[str],
) -> str | None:
    """
    Extract text belonging to a resume section.

    Example:
        EXPERIENCE
        Python Developer...
        EDUCATION
        B.Tech...
    """

    lines = text.splitlines()

    normalized_names = {
        name.lower().strip()
        for name in section_names
    }

    start_index = None

    for index, line in enumerate(lines):
        normalized = line.strip().lower()

        if normalized in normalized_names:
            start_index = index + 1
            break

    if start_index is None:
        return None

    section_lines = []

    known_sections = {
        "experience",
        "work experience",
        "professional experience",
        "education",
        "skills",
        "technical skills",
        "projects",
        "certifications",
        "certificates",
        "achievements",
        "summary",
        "profile",
        "objective",
        "contact",
    }

    for line in lines[start_index:]:
        normalized = line.strip().lower()

        if normalized in known_sections:
            break

        if line.strip():
            section_lines.append(line.strip())

    if not section_lines:
        return None

    return "\n".join(section_lines)


def parse_resume(file_path: str) -> dict:
    """
    Complete resume parsing pipeline.
    """

    text = extract_text_from_pdf(file_path)

    if not text:
        return {
            "name": None,
            "email": None,
            "phone": None,
            "skills": [],
            "experience": None,
            "education": None,
            "projects": None,
            "certificates": None,
            "raw_text": "",
        }

    experience = extract_section(
        text,
        [
            "experience",
            "work experience",
            "professional experience",
        ],
    )

    education = extract_section(
        text,
        [
            "education",
            "academic background",
            "educational qualifications",
        ],
    )

    projects = extract_section(
        text,
        [
            "projects",
            "academic projects",
            "personal projects",
        ],
    )

    certificates = extract_section(
        text,
        [
            "certifications",
            "certificates",
            "certification",
        ],
    )

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "experience": experience,
        "education": education,
        "projects": projects,
        "certificates": certificates,
        "raw_text": text,
    }