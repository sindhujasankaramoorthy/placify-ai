import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models.resume import Resume
from backend.app.models.ats_scan import ATSScan
from backend.app.schemas.ats import (
    ATSPresetsResponseSchema,
    ATSScanRequestSchema,
    ATSScanResponseSchema,
    ATSHistoryResponseSchema,
    ATSHistoryItemSchema,
)
from backend.app.services.ats_service import (
    ATS_PRESETS,
    check_rate_limit,
    perform_rule_based_analysis,
    analyze_with_claude_llm,
    format_resume_data_to_text,
)

router = APIRouter(prefix="/ats", tags=["ats"])


def get_current_user_id() -> int:
    return 1


@router.get("/presets", response_model=ATSPresetsResponseSchema)
def get_ats_presets():
    """Return realistic job description presets."""
    return {"presets": ATS_PRESETS}


@router.get("/history", response_model=ATSHistoryResponseSchema)
def get_ats_history(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Return the last 10 ATS scans for the authenticated user."""
    scans = (
        db.query(ATSScan)
        .filter(ATSScan.user_id == user_id)
        .order_by(ATSScan.id.desc())
        .limit(10)
        .all()
    )

    history_items = []
    for s in scans:
        try:
            parsed = json.loads(s.result_json)
        except:
            parsed = {}
        history_items.append(
            ATSHistoryItemSchema(
                id=s.id,
                userId=s.user_id,
                jobDescription=s.job_description,
                result=parsed,
                createdAt=s.created_at.isoformat() if s.created_at else "",
            )
        )

    return {"history": history_items}


@router.post("/scan", response_model=ATSScanResponseSchema)
def scan_resume_ats(
    request: ATSScanRequestSchema,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """
    Perform deep ATS scan on active resume against the provided Job Description.
    Applies rate-limiting, rule-based extraction, Claude LLM analysis with retry/fallback,
    and DB persistence.
    """
    # 1. Rate limiting
    allowed, reset_sec = check_rate_limit(user_id)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"You have reached the limit of 10 ATS scans per hour. Please try again in {reset_sec} seconds.",
            headers={"Retry-After": str(reset_sec)},
        )

    # 2. Resolve resume text
    resume_text = ""
    if request.resumeText and len(request.resumeText.strip()) >= 20:
        resume_text = request.resumeText.strip()
    elif request.resumeData:
        resume_text = format_resume_data_to_text(request.resumeData)

    # Check database if resumeText not in payload
    if not resume_text or len(resume_text) < 20:
        latest_resume = (
            db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.updated_at.desc(), Resume.id.desc())
            .first()
        )
        if latest_resume and latest_resume.content:
            resume_text = format_resume_data_to_text(latest_resume.content)

    if not resume_text or len(resume_text) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "NO_RESUME_FOUND",
                "message": "No active resume found for your account. Please upload or create your resume first on the Resume page.",
                "link": "/dashboard/resume",
            },
        )

    # 3. Rule-based analysis
    rule_res = perform_rule_based_analysis(resume_text, request.jobDescription)

    # 4. LLM analysis (with fallback & retry)
    final_res = analyze_with_claude_llm(resume_text, request.jobDescription, rule_res)

    # 5. Persist to database
    scan_record = ATSScan(
        user_id=user_id,
        job_description=request.jobDescription,
        result_json=json.dumps(final_res),
    )
    db.add(scan_record)
    db.commit()
    db.refresh(scan_record)

    return {
        "id": scan_record.id,
        "userId": user_id,
        **final_res,
    }
