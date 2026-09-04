import os
import json
import re
import requests
from typing import Dict, Any, List
from backend.app.services.ats_analyzer import analyze_resume_ats

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

ROLE_ACTION_VERBS = {
    "cloud": ["Architected", "Deployed", "Configured", "Automated", "Optimized", "Scaled", "Provisioned", "Secured"],
    "software": ["Engineered", "Developed", "Designed", "Implemented", "Refactored", "Built", "Optimized", "Integrated"],
    "data": ["Analyzed", "Modeled", "Extracted", "Transformed", "Pipeline-built", "Visualized", "Queried", "Optimized"],
    "frontend": ["Rendered", "Designed", "Constructed", "Optimized", "Implemented", "Styled", "Crafted", "Enhanced"],
    "backend": ["Architected", "Engineered", "Implemented", "Scaled", "Benchmarked", "Secured", "Decoupled", "Maintained"],
    "devops": ["Automated", "Orchestrated", "Containerized", "Deployed", "Monitored", "Provisioned", "Streamlined", "Secured"],
    "fullstack": ["Developed", "Engineered", "Architected", "Delivered", "Integrated", "Built", "Optimized", "Deployed"]
}


def tailor_resume_with_ai(content: Dict[str, Any], target_role: str) -> Dict[str, Any]:
    """
    Generate an improved, job-tailored resume using Google Gemini LLM API (if GEMINI_API_KEY set)
    or an intelligent truthful AI tailoring engine.
    
    STRICT CONSTRAINTS:
    - Never invent fake education, fake companies, fake dates, or unverified work experience.
    - Preserve 100% of user contact details, company names, degree names, and dates.
    - Optimize professional summary, action verbs, skill categories, and project wording for target_role.
    """
    if GEMINI_API_KEY:
        try:
            return _tailor_via_gemini_llm(content, target_role)
        except Exception as err:
            print(f"[AI TAILOR] Gemini API error, using intelligent fallback engine: {err}")

    return _tailor_via_rule_engine(content, target_role)


def _tailor_via_gemini_llm(content: Dict[str, Any], target_role: str) -> Dict[str, Any]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"""
You are an expert ATS Resume Optimizer and Senior Tech Recruiter.
Your task is to tailor the following ResumeData JSON payload for the target role: "{target_role}".

STRICT SAFETY & TRUTHFULNESS CONSTRAINTS:
1. DO NOT fabricate any fake companies, fictitious degrees, fake job titles, or unverified employment dates.
2. DO NOT invent false certifications, achievements, or skills the candidate does not have.
3. DO rewrite the professional summary to align positionally with the target role: "{target_role}" using strong impact language.
4. DO rewrite work experience bullet points using high-impact action verbs (e.g. Architected, Engineered, Optimized, Automated, Developed).
5. DO re-organize and categorize existing skills to emphasize relevance for "{target_role}".
6. DO refine project descriptions to highlight technologies and measurable impact.
7. Return ONLY valid JSON with the exact same structure as the input ResumeData payload.

Input ResumeData JSON:
{json.dumps(content, indent=2)}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
    }
    
    res = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=15)
    if res.status_code == 200:
        res_json = res.json()
        text_response = res_json['candidates'][0]['content']['parts'][0]['text']
        parsed_tailored = json.loads(text_response)
        
        # Verify structure preservation
        if "personalInfo" in parsed_tailored and "summary" in parsed_tailored:
            return parsed_tailored

    raise ValueError(f"Gemini API returned status {res.status_code}: {res.text[:200]}")


def _tailor_via_rule_engine(content: Dict[str, Any], target_role: str) -> Dict[str, Any]:
    tailored = json.loads(json.dumps(content))  # Deep copy
    role_lower = target_role.lower()
    
    # 1. Select role action verbs
    selected_verbs = ROLE_ACTION_VERBS["fullstack"]
    for k, verbs in ROLE_ACTION_VERBS.items():
        if k in role_lower:
            selected_verbs = verbs
            break

    # 2. Tailor Summary
    original_summary = tailored.get("summary", "").strip()
    
    if original_summary:
        tailored["summary"] = f"Results-driven technical professional targeting {target_role} roles. {original_summary} Focused on delivering robust software architectures, optimizing performance, and building scalable solutions."
    else:
        tailored["summary"] = f"Motivated software professional targeting {target_role} opportunities. Demonstrated expertise in full-lifecycle development, problem solving, and modern technical architectures."

    # 3. Tailor Experience Bullets with Action Verbs
    verb_idx = 0
    for exp in tailored.get("experience", []):
        bullets = exp.get("bullets", [])
        new_bullets = []
        for bullet in bullets:
            clean_b = bullet.strip()
            first_word = clean_b.split()[0] if clean_b else ""
            if not any(first_word.lower().startswith(v.lower()) for v in selected_verbs):
                verb = selected_verbs[verb_idx % len(selected_verbs)]
                verb_idx += 1
                clean_b = f"{verb} {clean_b[0].lower() + clean_b[1:]}" if clean_b else f"{verb} system components."
            new_bullets.append(clean_b)
        exp["bullets"] = new_bullets

    for exp in tailored.get("internships", []):
        bullets = exp.get("bullets", [])
        new_bullets = []
        for bullet in bullets:
            clean_b = bullet.strip()
            verb = selected_verbs[verb_idx % len(selected_verbs)]
            verb_idx += 1
            if clean_b and not clean_b.startswith(tuple(selected_verbs)):
                clean_b = f"{verb} {clean_b[0].lower() + clean_b[1:]}"
            new_bullets.append(clean_b)
        exp["bullets"] = new_bullets

    # 4. Tailor & Categorize Skills for Target Role
    existing_cats = tailored.get("skills", [])
    all_skills_flat = []
    for cat in existing_cats:
        for s in cat.get("skills", []):
            if s.strip() and s.strip() not in all_skills_flat:
                all_skills_flat.append(s.strip())

    if all_skills_flat:
        tailored["skills"] = [
            {
                "id": "cat-target-core",
                "categoryName": f"Core Skills for {target_role}",
                "skills": all_skills_flat[:6]
            },
            {
                "id": "cat-target-tools",
                "categoryName": "Tools & Technologies",
                "skills": all_skills_flat[6:] if len(all_skills_flat) > 6 else all_skills_flat
            }
        ]

    # 5. Tailor Projects
    for proj in tailored.get("projects", []):
        desc = proj.get("description", "").strip()
        if desc and target_role not in desc:
            proj["description"] = f"{desc} (Engineered with focus on {target_role} principles)."

    return tailored
