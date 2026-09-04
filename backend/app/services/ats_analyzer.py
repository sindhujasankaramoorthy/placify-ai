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
    else:
        feedback.append({"type": "warning", "message": "Add a LinkedIn or GitHub profile link for better ATS ranking."})

    # 2. Professional Summary (15 pts)
    if summary and len(summary.strip()) >= 50:
        score += 15
        feedback.append({"type": "pass", "message": "Strong professional summary included."})
    elif summary:
        score += 8
        feedback.append({"type": "warning", "message": "Expand your summary to 2-3 sentences highlighting your domain impact."})
    else:
        feedback.append({"type": "warning", "message": "Add a professional summary at the top of your resume."})

    # 3. Work Experience / Internships (25 pts)
    total_exp = len(experience) + len(internships)
    if total_exp > 0:
        score += 15
        # Check action verbs in bullets
        has_verbs = False
        all_bullets = []
        for exp in experience:
            all_bullets.extend(exp.get("bullets", []))
        for item in internships:
            all_bullets.extend(item.get("bullets", []))

        text_content = " ".join(all_bullets).lower()
        if any(verb in text_content for verb in ACTION_VERBS):
            has_verbs = True
            score += 10
            feedback.append({"type": "pass", "message": "Action-oriented impact verbs detected in experience bullets."})
        else:
            feedback.append({"type": "warning", "message": "Start bullet points with strong action verbs (e.g., Engineered, Optimized)."})
    else:
        feedback.append({"type": "warning", "message": "No work experience or internships added yet."})

    # 4. Technical Projects (15 pts)
    if len(projects) >= 2:
        score += 15
        feedback.append({"type": "pass", "message": f"{len(projects)} featured projects showcasing technical abilities."})
    elif len(projects) == 1:
        score += 10
        feedback.append({"type": "warning", "message": "Add at least 2 impactful projects with GitHub repositories."})
    else:
        feedback.append({"type": "warning", "message": "Include key technical projects demonstrating real-world problem solving."})

    # 5. Categorized Skills (15 pts)
    all_skills = []
    for sc in skills_cat:
        all_skills.extend(sc.get("skills", []))

    if len(all_skills) >= 8:
        score += 15
        feedback.append({"type": "pass", "message": f"Broad skill coverage with {len(all_skills)} relevant technical skills."})
    elif len(all_skills) >= 4:
        score += 10
        feedback.append({"type": "warning", "message": "Add more categorized skills (aim for at least 8-10)."})
    else:
        feedback.append({"type": "warning", "message": "Add a dedicated skills section categorized by domain."})

    # 6. Education & Certifications (10 pts)
    if len(education) > 0:
        score += 5
        feedback.append({"type": "pass", "message": "Education history included with degree details."})
    if len(certifications) > 0:
        score += 5
        feedback.append({"type": "pass", "message": "Verified industry certifications listed."})

    # Detected Keywords
    full_search_text = (
        f"{summary} {' '.join(all_skills)} " +
        " ".join([p.get("description", "") + " " + " ".join(p.get("technologies", [])) for p in projects]) +
        " ".join([e.get("position", "") + " " + " ".join(e.get("bullets", [])) for e in experience])
    ).lower()

    detected_keywords = [
        kw for kw in INDUSTRY_KEYWORDS if kw.lower() in full_search_text
    ]

    missing_skills = [
        kw for kw in INDUSTRY_KEYWORDS[:8] if kw.lower() not in full_search_text
    ]

    return {
        "ats_score": min(score, 100),
        "feedback": feedback,
        "keywords": detected_keywords,
        "missing_skills": missing_skills[:4]
    }
