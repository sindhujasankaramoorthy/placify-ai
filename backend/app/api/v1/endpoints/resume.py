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
    AIPersonalizeRequestSchema,
    AIPersonalizeResponseSchema,
)
from backend.app.services.parser import (
    extract_text_from_pdf,
    extract_text_from_docx,
    parse_resume_text_to_data,
)
from backend.app.services.ats_analyzer import analyze_resume_ats
from backend.app.services.ai_tailor import tailor_resume_with_ai
from backend.app.services.ai_personalizer import personalize_resume_zero_hallucination

router = APIRouter(prefix="/resumes", tags=["resumes"])


def get_current_user_id() -> int:
    # Default authenticated user id for local development
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
            detail="Resume not found.",
        )
    return resume


@router.post("", response_model=ResumeResponseSchema, status_code=status.HTTP_201_CREATED)
def create_new_resume(
    resume_in: ResumeCreateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Create a new resume version for the user."""
    db_resume = Resume(
        user_id=user_id,
        title=resume_in.title,
        template_id=resume_in.template_id,
        content=resume_in.content,
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume


@router.put("/{resume_id}", response_model=ResumeResponseSchema)
def update_existing_resume(
    resume_id: int,
    resume_in: ResumeUpdateSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Update an existing resume version."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    if resume_in.title is not None:
        resume.title = resume_in.title
    if resume_in.template_id is not None:
        resume.template_id = resume_in.template_id
    if resume_in.content is not None:
        resume.content = resume_in.content

    db.commit()
    db.refresh(resume)
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Delete a resume by ID."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )
    db.delete(resume)
    db.commit()
    return None


@router.post("/parse-file")
async def parse_resume_upload(file: UploadFile = File(...)):
    """Extract and parse candidate details from uploaded PDF or DOCX file."""
    filename = (file.filename or "").lower()
    contents = await file.read()

    if filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(contents)
    elif filename.endswith((".docx", ".doc")):
        raw_text = extract_text_from_docx(contents)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF or DOCX file.",
        )

    parsed_data = parse_resume_text_to_data(raw_text)
    return parsed_data


@router.post("/analyze-ats")
def analyze_ats(payload: Dict[str, Any]):
    """Run live ATS audit on ResumeData payload."""
    return analyze_resume_ats(payload)


@router.post("/tailor", response_model=AITailorResponseSchema)
def tailor_resume(request: AITailorRequestSchema):
    """Generate job-tailored resume content for a target job role."""
    return tailor_resume_with_ai(request.content, request.target_role)


@router.post("/personalize", response_model=AIPersonalizeResponseSchema)
def personalize_resume_endpoint(request: AIPersonalizeRequestSchema):
    """
    Generate an ATS-optimized, job-personalized resume tailored strictly for a chosen job.
    Strictly prevents hallucinations: zero fake degrees, zero fake companies, zero fabricated metrics.
    """
    return personalize_resume_zero_hallucination(
        content=request.content,
        target_role=request.target_role,
        company_name=request.company_name,
        job_description=request.job_description,
        required_skills=request.required_skills,
    )


@router.post("/upload-and-personalize", response_model=AIPersonalizeResponseSchema)
async def upload_and_personalize_endpoint(
    file: UploadFile = File(...),
    target_role: str = "Software Engineer",
    company_name: str = "Target Company",
    job_description: str = "",
    required_skills: str = "",  # comma-separated
):
    """Upload resume file and personalize directly for target job without hallucination."""
    filename = (file.filename or "").lower()
    contents = await file.read()

    if filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(contents)
    elif filename.endswith((".docx", ".doc")):
        raw_text = extract_text_from_docx(contents)
    else:
        raw_text = contents.decode("utf-8", errors="ignore")

    parsed_data = parse_resume_text_to_data(raw_text)
    skills_list = [s.strip() for s in required_skills.split(",") if s.strip()]

    return personalize_resume_zero_hallucination(
        content=parsed_data,
        target_role=target_role,
        company_name=company_name,
        job_description=job_description,
        required_skills=skills_list,
    )

