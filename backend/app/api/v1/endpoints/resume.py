from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models.resume import Resume
from backend.app.schemas.resume import (
    ResumeCreateSchema,
    ResumeUpdateSchema,
    ResumeResponseSchema,
    ResumeContentSchema,
    AITailorRequestSchema,
    AITailorResponseSchema,
)
from backend.app.services.parser import (
    extract_text_from_pdf,
    extract_text_from_docx,
    parse_resume_text_to_data,
)
from backend.app.services.ats_analyzer import analyze_resume_ats
from backend.app.services.ai_tailor import tailor_resume_with_ai

router = APIRouter(prefix="/resumes", tags=["resumes"])


def get_current_user_id() -> int:
    return 1


@router.get("", response_model=List[ResumeResponseSchema])
def get_user_resumes(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Retrieve all resumes for the authenticated user."""
    resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
    return resumes


@router.get("/{resume_id}", response_model=ResumeResponseSchema)
def get_resume_by_id(
    resume_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Retrieve a specific resume by ID for the authenticated user."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )
    return resume


@router.post("", response_model=ResumeResponseSchema, status_code=status.HTTP_201_CREATED)
def create_resume(
    resume_in: ResumeCreateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Create a new dynamic resume record for the authenticated user."""
    db_resume = Resume(
        user_id=user_id,
        title=resume_in.title,
        template_id=resume_in.template_id,
        content=resume_in.content.model_dump(),
        ats_score=0,
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume


@router.put("/{resume_id}", response_model=ResumeResponseSchema)
def update_resume(
    resume_id: int,
    resume_in: ResumeUpdateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Update resume content, template ID, or title."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    if resume_in.title is not None:
        resume.title = resume_in.title
    if resume_in.template_id is not None:
        resume.template_id = resume_in.template_id
    if resume_in.content is not None:
        resume.content = resume_in.content.model_dump()
    if resume_in.ats_score is not None:
        resume.ats_score = resume_in.ats_score

    db.commit()
    db.refresh(resume)
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Delete a resume."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )
    db.delete(resume)
    db.commit()
    return None


@router.post("/parse-file", response_model=ResumeContentSchema)
async def parse_resume_file(file: UploadFile = File(...)):
    """
    Upload an existing PDF or DOCX resume, extract its actual text,
    and parse it into structured ResumeData JSON to auto-populate the editor.
    """
    contents = await file.read()
    filename_lower = file.filename.lower() if file.filename else ""

    if filename_lower.endswith(".pdf"):
        raw_text = extract_text_from_pdf(contents)
    elif filename_lower.endswith(".docx") or filename_lower.endswith(".doc"):
        raw_text = extract_text_from_docx(contents)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF or DOCX document."
        )

    if not raw_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not extract text from document. Please ensure file is not scanned/image-only."
        )

    parsed_data = parse_resume_text_to_data(raw_text)
    return parsed_data


@router.post("/analyze-ats", response_model=Dict[str, Any])
def analyze_resume_ats_endpoint(content: ResumeContentSchema):
    """
    Dynamically analyze current ResumeData content to produce ATS score,
    keywords, missing skills, and actionable recommendations.
    """
    return analyze_resume_ats(content.model_dump())


@router.post("/generate-ai-tailored", response_model=AITailorResponseSchema)
def generate_ai_tailored_resume_endpoint(payload: AITailorRequestSchema):
    """
    Generate an improved, job-tailored resume based on target_role and current content.
    ATS score is dynamically recalculated from the resulting generated resume content.
    """
    tailored = tailor_resume_with_ai(payload.content.model_dump(), payload.target_role)
    ats = analyze_resume_ats(tailored)
    return {
        "tailored_content": tailored,
        "ats_analysis": ats
    }
