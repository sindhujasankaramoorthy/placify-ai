import re
from typing import Dict, Any, List

INDUSTRY_KEYWORDS = [
  "Docker", "Kubernetes", "GraphQL", "CI/CD", "REST APIs", "Redis",
  "Microservices", "Python", "React", "TypeScript", "SQL", "Git",
  "FastAPI", "TailwindCSS", "Node.js", "AWS", "System Design"
]

ACTION_VERBS = [
  "built", "developed", "designed", "engineered", "implemented",
  "led", "optimized", "architected", "refactored", "delivered",
  "increased", "reduced", "scaled", "automated", "created"
]

def analyze_resume_ats(content: Dict[str, Any]) -> Dict[str, Any]:
    """
    Dynamically analyze ResumeData JSON payload to produce ATS Score, Keyword Suggestions,
    Missing Skills, and Actionable Feedback Items without any fake or hardcoded values.
    """
    personal = content.get("personalInfo", {})
    summary = content.get("summary", "")
    education = content.get("education", [])
    experience = content.get("experience", [])
    internships = content.get("internships", [])
    projects = content.get("projects", [])
    skills_cat = content.get("skills", [])
    certifications = content.get("certifications", [])

    score = 0
    feedback = []

    # 1. Contact Details Audit (20 pts)
    if personal.get("fullName"):
        score += 5
    else:
        feedback.append({"type": "warning", "message": "Missing full name in personal information."})

    if personal.get("email"):
        score += 5
    else:
        feedback.append({"type": "warning", "message": "Missing email address."})

    if personal.get("phone"):
        score += 5
    else:
        feedback.append({"type": "warning", "message": "Missing phone number."})

    if personal.get("linkedin") or personal.get("github") or personal.get("portfolio"):
        score += 5
        feedback.append({"type": "pass", "message": "Online profiles / Portfolio linked."})
    else:
        feedback.append({"type": "warning", "message": "Add a LinkedIn or GitHub link for higher ATS score."})

    # 2. Professional Summary Audit (15 pts)
    if summary and len(summary.strip()) >= 30:
        score += 15
        feedback.append({"type": "pass", "message": "Strong professional summary included."})
    elif summary:
        score += 8
        feedback.append({"type": "warning", "message": "Summary is brief; consider expanding career overview."})
    else:
        feedback.append({"type": "warning", "message": "Add a professional summary section."})

    # 3. Work Experience & Action Verbs (25 pts)
    all_exp = experience + internships
    if all_exp:
        score += 15
        has_verbs = False
        has_numbers = False

        for item in all_exp:
            bullets = item.get("bullets", [])
            for b in bullets:
                if any(verb in b.lower() for verb in ACTION_VERBS):
                    has_verbs = True
                if re.search(r'\d+%|\d+\+|\$\d+|\d+\s?(users|ms|sec|x)', b.lower()):
                    has_numbers = True

        if has_verbs:
            score += 5
            feedback.append({"type": "pass", "message": "Strong action verbs detected in bullet points."})
        else:
            feedback.append({"type": "warning", "message": "Use strong action verbs (e.g. Developed, Led, Optimized)."})

        if has_numbers:
            score += 5
            feedback.append({"type": "pass", "message": "Quantified impact & metrics included in experience."})
        else:
            feedback.append({"type": "warning", "message": "Add metric numbers or percentage metrics to bullet points."})
    else:
        feedback.append({"type": "warning", "message": "No work experience or internship entries listed."})

    # 4. Education Audit (15 pts)
    if education:
        score += 15
        feedback.append({"type": "pass", "message": "Education credentials verified."})
    else:
        feedback.append({"type": "warning", "message": "Add education history or degree information."})

    # 5. Skills Audit (15 pts)
    user_skills = set()
    for cat in skills_cat:
        for s in cat.get("skills", []):
            if s.strip():
                user_skills.add(s.strip().lower())

    if len(user_skills) >= 5:
        score += 15
        feedback.append({"type": "pass", "message": f"Good skills coverage ({len(user_skills)} skills listed)."})
    elif len(user_skills) > 0:
        score += 8
        feedback.append({"type": "warning", "message": "Add more relevant technical skills."})
    else:
        feedback.append({"type": "warning", "message": "No skills listed."})

    # 6. Projects & Certifications (10 pts)
    if projects or certifications:
        score += 10
        feedback.append({"type": "pass", "message": "Projects / Certifications showcased."})
    else:
        feedback.append({"type": "warning", "message": "Include projects or certifications."})

    # Determine Present Keywords & Missing Skills
    present_keywords = []
    missing_skills = []

    for kw in INDUSTRY_KEYWORDS:
        if kw.lower() in user_skills or kw.lower() in str(content).lower():
            present_keywords.append(kw)
        else:
            missing_skills.append(kw)

    return {
        "ats_score": min(score, 100),
        "keywords": present_keywords[:8],
        "missing_skills": missing_skills[:4],
        "feedback": feedback
    }
