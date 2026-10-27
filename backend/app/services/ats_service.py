import os
import re
import time
import json
from typing import Dict, Any, List, Tuple
import requests

ATS_PRESETS = [
    {
        "id": "accenture-ai-intern",
        "company": "Accenture India",
        "role": "AI & Full-Stack Developer Intern",
        "chipLabel": "Accenture India - AI & Full-Stack Developer Intern",
        "badge": "AI / GenAI",
        "description": """Accenture India is hiring an AI & Full-Stack Developer Intern.

About the Role:
Join our Advanced Technology Centers in India (ATCI) to design, build, and deploy next-generation enterprise applications incorporating AI agents, Retrieval-Augmented Generation (RAG), and modern full-stack architectures.

Key Responsibilities:
- Design and implement end-to-end web applications with interactive frontends and scalable microservices.
- Build intelligent generative AI components, utilizing vector databases (FAISS, Chroma, Pinecone) and embedding pipelines.
- Integrate RESTful APIs, manage database queries, and optimize query latency in SQL / MongoDB.
- Write clean, maintainable, and well-tested code following agile best practices.
- Collaborate with senior architects and cross-functional engineering teams during sprint cycles.

Required Skills & Qualifications:
- Currently pursuing B.E. / B.Tech / M.Tech in Computer Science, Information Technology, or related discipline (2025 / 2026 / 2027 batch).
- Solid programming proficiency in Python, Java, or TypeScript.
- Hands-on experience with modern frontend frameworks like React or Next.js and styling with TailwindCSS.
- Practical understanding of Retrieval-Augmented Generation (RAG), LLMs, and prompt engineering.
- Familiarity with SQL (PostgreSQL / MySQL) and NoSQL (MongoDB) databases.
- Version control using Git / GitHub and understanding of CI/CD pipelines.
- Strong analytical reasoning and problem-solving skills."""
    },
    {
        "id": "tcs-sde-fresher",
        "company": "Tata Consultancy Services (TCS)",
        "role": "Software Engineer Fresher",
        "chipLabel": "TCS - Software Engineer Fresher",
        "badge": "Enterprise SDE",
        "description": """Tata Consultancy Services (TCS) is hiring Associate Software Engineers (Freshers).

Job Overview:
As a Software Engineer at TCS, you will work on enterprise-scale distributed systems, banking and cloud applications, and data-driven solutions for Fortune 500 global clients.

Key Responsibilities:
- Participate in the complete Software Development Life Cycle (SDLC) from requirements analysis to deployment.
- Develop robust, scalable back-end services using Java, Python, or C++.
- Build responsive user interfaces utilizing HTML5, CSS3, and JavaScript / TypeScript.
- Write optimized SQL queries, stored procedures, and schema migrations for relational databases (MySQL, Oracle, PostgreSQL).
- Implement and document secure RESTful web services and API endpoints.
- Perform unit testing, integration testing, and participate in code reviews.
- Identify performance bottlenecks and implement bug fixes.

Required Skills & Qualifications:
- Bachelor's degree (B.E. / B.Tech / B.Sc / BCA / MCA) in Computer Science, Engineering, or relevant technical field.
- Strong foundational knowledge of Object-Oriented Programming (OOP) concepts, Data Structures, and Algorithms.
- Working knowledge of Java or Python, plus web fundamentals (HTML, CSS, JavaScript).
- Hands-on database experience with MySQL, PostgreSQL, or SQLite.
- Basic familiarity with Git, Linux environments, and REST APIs.
- Excellent verbal and written communication skills and eagerness to learn new technologies."""
    },
    {
        "id": "innovate-devops-associate",
        "company": "Innovate Solutions",
        "role": "Cloud & DevOps Associate",
        "chipLabel": "Innovate Solutions - Cloud & DevOps Associate",
        "badge": "Cloud / DevOps",
        "description": """Innovate Solutions is looking for a Cloud & DevOps Associate.

Job Overview:
We are seeking an enthusiastic DevOps and Cloud Infrastructure Associate to support our containerized production environments, automate deployment pipelines, and maintain high availability across our cloud services.

Key Responsibilities:
- Containerize application microservices using Docker and orchestrate clusters with Kubernetes.
- Deploy, configure, and monitor scalable cloud resources on Amazon Web Services (AWS) including EC2, S3, RDS, and VPC.
- Build and maintain automated Continuous Integration and Continuous Deployment (CI/CD) pipelines using GitHub Actions.
- Write automation and maintenance scripts in Python and Bash.
- Set up system telemetry, health alerts, and logging using Prometheus, Grafana, and AWS CloudWatch.
- Implement security best practices, access management (IAM), and network firewall configurations.

Required Skills & Qualifications:
- Degree in Computer Science, Information Technology, or equivalent practical cloud experience.
- Demonstrable hands-on experience with Docker containerization and Kubernetes orchestration.
- Knowledge of AWS core services (EC2, S3, IAM, CloudWatch, Lambda).
- Proficiency with Linux command line, shell scripting (Bash), and Python scripting.
- Understanding of CI/CD concepts, automated testing, and Git version control workflows.
- Familiarity with Infrastructure as Code (IaC) principles using Terraform is a strong plus."""
    }
]

# Tech Synonyms Dictionary
TECH_SYNONYMS = {
    "JavaScript": ["js", "javascript", "ecmascript"],
    "TypeScript": ["ts", "typescript"],
    "Node.js": ["node", "nodejs", "node.js"],
    "React": ["react", "reactjs", "react.js"],
    "Next.js": ["next", "nextjs", "next.js"],
    "Vue": ["vue", "vuejs", "vue.js"],
    "Angular": ["angular", "angularjs"],
    "Python": ["python", "python3", "py"],
    "Java": ["java", "jdk", "jvm", "core java"],
    "C++": ["c++", "cpp"],
    "C#": ["c#", "csharp", "c-sharp"],
    "Go": ["go", "golang"],
    "Rust": ["rust", "rustlang"],
    "Docker": ["docker", "containerization", "containers", "dockerfile"],
    "Kubernetes": ["k8s", "kubernetes", "kube"],
    "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda", "cloudwatch"],
    "Azure": ["azure", "microsoft azure"],
    "GCP": ["gcp", "google cloud", "google cloud platform"],
    "MongoDB": ["mongodb", "mongo"],
    "PostgreSQL": ["postgres", "postgresql", "psql"],
    "MySQL": ["mysql"],
    "Redis": ["redis"],
    "GraphQL": ["graphql", "gql"],
    "REST APIs": ["rest", "restful", "rest api", "rest apis", "restful api"],
    "SQL": ["sql", "rdbms", "relational database"],
    "Git": ["git", "github", "gitlab", "version control"],
    "CI/CD": ["ci/cd", "cicd", "continuous integration", "github actions", "jenkins", "gitlab ci"],
    "Linux": ["linux", "unix", "ubuntu", "bash", "shell"],
    "TailwindCSS": ["tailwind", "tailwindcss"],
    "FastAPI": ["fastapi", "fast-api"],
    "Django": ["django"],
    "Flask": ["flask"],
    "Spring Boot": ["spring", "spring boot", "springboot"],
    "RAG": ["rag", "retrieval augmented generation", "retrieval-augmented generation"],
    "FAISS": ["faiss", "vector database", "vector embeddings", "embeddings"],
    "LLM": ["llm", "large language model", "large language models", "genai", "generative ai"],
    "Machine Learning": ["ml", "machine learning", "supervised learning"],
    "Deep Learning": ["deep learning", "neural networks", "pytorch", "tensorflow"],
    "Terraform": ["terraform", "iac", "infrastructure as code"],
    "HTML5": ["html", "html5"],
    "CSS3": ["css", "css3"]
}

INDUSTRY_KEYWORDS = {
    "Agile / Scrum": ["agile", "scrum", "sprint", "kanban"],
    "Unit Testing": ["unit test", "unit testing", "jest", "pytest", "junit", "testing"],
    "System Design": ["system design", "microservices", "distributed systems", "high availability", "scalability"],
    "Data Structures": ["data structures", "algorithms", "dsa", "problem solving", "algorithmic"],
    "Object-Oriented Programming": ["oop", "object-oriented", "object oriented", "design patterns"],
    "Cloud Architecture": ["cloud architecture", "serverless", "cloud computing"],
    "API Design": ["api design", "api integration", "endpoints", "swagger", "openapi"],
    "Performance Optimization": ["optimization", "performance tuning", "caching", "latency reduction", "scalability"],
    "Code Review": ["code review", "code quality", "clean code", "maintainability"]
}

# Rate limit tracker in memory (10 scans / hour per user)
user_scan_history: Dict[str, List[float]] = {}
RATE_LIMIT_WINDOW = 3600  # 1 hour
MAX_SCANS_PER_WINDOW = 10


def check_rate_limit(user_id: int) -> Tuple[bool, int]:
    key = str(user_id)
    now = time.time()
    timestamps = user_scan_history.get(key, [])
    timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]

    if len(timestamps) >= MAX_SCANS_PER_WINDOW:
        reset_seconds = int(timestamps[0] + RATE_LIMIT_WINDOW - now)
        return False, max(1, reset_seconds)

    timestamps.append(now)
    user_scan_history[key] = timestamps
    return True, 0


def text_contains_term(text: str, term: str) -> bool:
    clean_term = re.escape(term)
    pattern = rf'(?:^|[^a-zA-Z0-9_#+]){clean_term}(?:$|[^a-zA-Z0-9_#+])'
    return bool(re.search(pattern, text, re.IGNORECASE))


def check_synonym_match(text: str, synonyms: List[str]) -> bool:
    return any(text_contains_term(text, syn) for syn in synonyms)


def format_resume_data_to_text(data: Dict[str, Any]) -> str:
    if not isinstance(data, dict):
        return ""

    sections = []
    p = data.get("personalInfo", data)
    name = p.get("fullName") or p.get("name") or ""
    email = p.get("email") or ""
    phone = p.get("phone") or ""
    location = p.get("location") or ""
    linkedin = p.get("linkedin") or p.get("linkedinUrl") or ""
    github = p.get("github") or p.get("githubUrl") or ""

    contact_parts = [part for part in [name, email, phone, location, linkedin, github] if part]
    if contact_parts:
        sections.append(" | ".join(contact_parts))

    summary = data.get("summary") or p.get("summary")
    if summary and isinstance(summary, str) and summary.strip():
        sections.append(f"PROFESSIONAL SUMMARY\n{summary.strip()}")

    skills = data.get("skills")
    if isinstance(skills, list):
        skill_lines = []
        for cat in skills:
            if isinstance(cat, str):
                skill_lines.append(cat)
            elif isinstance(cat, dict):
                cname = cat.get("categoryName") or cat.get("category") or "Skills"
                slist = cat.get("skills", [])
                skill_lines.append(f"{cname}: {', '.join(slist) if isinstance(slist, list) else str(slist)}")
        if skill_lines:
            sections.append(f"TECHNICAL SKILLS\n" + "\n".join(skill_lines))

    experience = data.get("experience", []) + data.get("internships", [])
    if isinstance(experience, list) and experience:
        exp_lines = []
        for exp in experience:
            if isinstance(exp, dict):
                role = exp.get("position") or exp.get("role") or ""
                company = exp.get("company") or ""
                bullets = exp.get("bullets") or exp.get("highlights") or []
                bullet_str = "\n".join([f"• {b}" for b in bullets]) if isinstance(bullets, list) else ""
                exp_lines.append(f"{role} | {company}\n{bullet_str}".strip())
        if exp_lines:
            sections.append("WORK EXPERIENCE & INTERNSHIPS\n" + "\n\n".join(exp_lines))

    projects = data.get("projects", [])
    if isinstance(projects, list) and projects:
        proj_lines = []
        for proj in projects:
            if isinstance(proj, dict):
                title = proj.get("title") or proj.get("name") or ""
                desc = proj.get("description") or ""
                bullets = proj.get("bullets") or proj.get("highlights") or []
                bullet_str = "\n".join([f"• {b}" for b in bullets]) if isinstance(bullets, list) else ""
                proj_lines.append(f"{title}\n{desc}\n{bullet_str}".strip())
        if proj_lines:
            sections.append("TECHNICAL PROJECTS\n" + "\n\n".join(proj_lines))

    education = data.get("education", [])
    if isinstance(education, list) and education:
        edu_lines = []
        for edu in education:
            if isinstance(edu, dict):
                deg = edu.get("degree") or ""
                inst = edu.get("institution") or ""
                edu_lines.append(f"{deg} | {inst}".strip())
        if edu_lines:
            sections.append("EDUCATION\n" + "\n".join(edu_lines))

    return "\n\n".join(sections)


def perform_rule_based_analysis(resume_text: str, job_description: str) -> Dict[str, Any]:
    norm_resume = resume_text.lower()
    norm_jd = job_description.lower()

    # 1. Tech Stack
    jd_tech_matched = []
    jd_tech_missing = []

    for canonical, syns in TECH_SYNONYMS.items():
        if check_synonym_match(norm_jd, syns):
            if check_synonym_match(norm_resume, syns):
                jd_tech_matched.append(canonical)
            else:
                jd_tech_missing.append(canonical)

    # 2. Industry Keywords
    jd_kw_matched = []
    jd_kw_missing = []

    for canonical, syns in INDUSTRY_KEYWORDS.items():
        if check_synonym_match(norm_jd, syns):
            if check_synonym_match(norm_resume, syns):
                jd_kw_matched.append(canonical)
            else:
                jd_kw_missing.append(canonical)

    # Match score calculation
    total_tech = len(jd_tech_matched) + len(jd_tech_missing)
    total_kw = len(jd_kw_matched) + len(jd_kw_missing)

    match_score = 75
    if total_tech > 0:
        ratio = len(jd_tech_matched) / total_tech
        kw_ratio = len(jd_kw_matched) / total_kw if total_kw > 0 else ratio
        match_score = round((ratio * 0.75 + kw_ratio * 0.25) * 100)
    elif len(jd_tech_matched) > 0:
        match_score = 85

    # 3. Structure & Sections
    sections_expected = [
        ("Contact Information", r'\b(email|phone|contact|linkedin|github|portfolio)\b'),
        ("Professional Summary", r'\b(summary|objective|profile|about me|professional summary)\b'),
        ("Education", r'\b(education|university|college|degree|b\.?e\.?|b\.?tech|bachelor|master)\b'),
        ("Technical Skills", r'\b(skills|technical skills|technologies|proficiencies|tools|languages)\b'),
        ("Experience / Internships", r'\b(experience|work experience|employment|internship|internships|professional experience)\b'),
        ("Projects", r'\b(projects|personal projects|academic projects|key projects)\b'),
    ]

    sections_found = []
    sections_missing = []

    for name, pattern in sections_expected:
        if re.search(pattern, norm_resume, re.IGNORECASE):
            sections_found.append(name)
        else:
            sections_missing.append(name)

    structure_score = round((len(sections_found) / len(sections_expected)) * 100)

    # 4. Formatting Checks
    formatting_score = 100
    deductions = []

    has_email = bool(re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', resume_text))
    if not has_email:
        formatting_score -= 15
        deductions.append("Missing standard email address format.")

    has_phone = bool(re.search(r'(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}', resume_text))
    if not has_phone:
        formatting_score -= 10
        deductions.append("Missing standard phone number.")

    bullets = len(re.findall(r'[•\-*]|\d+\.\s', resume_text))
    if bullets < 4:
        formatting_score -= 15
        deductions.append("Few or missing bullet points; ATS systems parse bulleted achievements better than paragraph blocks.")

    words = len(resume_text.split())
    if words < 120:
        formatting_score -= 20
        deductions.append("Resume content is sparse (under 120 words). Include detailed project and experience descriptions.")
    elif words > 1500:
        formatting_score -= 10
        deductions.append("Resume length is excessive (over 1500 words). Aim for a concise 1-2 page layout.")

    has_metrics = bool(re.search(r'\b\d+%\b|\b\d+x\b|\b\$\d+|\b\d+\+\s?(users|clients|requests|ms|seconds|hours)', resume_text, re.IGNORECASE))
    if not has_metrics:
        formatting_score -= 10
        deductions.append("Lack of quantifiable metric results (e.g. 'reduced latency by 40%', 'served 10k users').")

    formatting_score = max(20, min(100, formatting_score))

    # Overall score: 60% match + 20% formatting + 20% structure
    overall_score = max(10, min(100, round(
        match_score * 0.60 + formatting_score * 0.20 + structure_score * 0.20
    )))

    verdict = "Moderate match"
    if overall_score >= 80:
        verdict = "Strong match"
    elif overall_score < 60:
        verdict = "Weak match"

    strengths = []
    if jd_tech_matched:
        strengths.append(f"Core competencies aligned: matches {len(jd_tech_matched)} key required tech stack items ({', '.join(jd_tech_matched[:4])}).")
    if "Projects" in sections_found and "Technical Skills" in sections_found:
        strengths.append("Well-defined technical skills and practical projects sections detected.")
    if has_metrics:
        strengths.append("Incorporates quantifiable performance metrics and outcome indicators.")
    if has_email and has_phone:
        strengths.append("Clear candidate contact information formatted properly for ATS parsing.")
    if bullets >= 6:
        strengths.append("Effective bullet-pointed accomplishments highlighting discrete deliverables.")

    weaknesses = []
    if jd_tech_missing:
        weaknesses.append(f"Missing prominent target skills specified in the job description: {', '.join(jd_tech_missing[:4])}.")
    if sections_missing:
        weaknesses.append(f"Missing standard ATS resume sections: {', '.join(sections_missing)}.")
    if deductions:
        weaknesses.append(deductions[0])
    if not has_metrics:
        weaknesses.append("Bullet points are predominantly descriptive rather than results-oriented with quantifiable impact.")

    suggestions = []
    if jd_tech_missing:
        suggestions.append(f"Incorporate missing target technologies [{', '.join(jd_tech_missing[:3])}] into your skills taxonomy or describe relevant coursework/projects using them.")
    if "Professional Summary" in sections_missing:
        suggestions.append("Add a focused 2-3 sentence Professional Summary at the top tailored to this target role.")
    if not has_metrics:
        suggestions.append("Apply the Google XYZ framework: 'Accomplished [X] measured by [Y] by doing [Z]' to articulate project achievements.")
    if "Projects" in sections_missing:
        suggestions.append("Create a dedicated 'Key Projects' section detailing technical architecture, libraries, and live/GitHub links.")
    suggestions.append("Ensure job titles and section headings match standard industry conventions so ATS parsers index them cleanly.")

    return {
        "overallScore": overall_score,
        "matchScore": match_score,
        "formattingScore": formatting_score,
        "structureScore": structure_score,
        "techStack": {
            "matched": jd_tech_matched,
            "missing": jd_tech_missing,
        },
        "keywords": {
            "matched": jd_kw_matched,
            "missing": jd_kw_missing,
        },
        "sectionsFound": sections_found,
        "sectionsMissing": sections_missing,
        "strengths": strengths[:4],
        "weaknesses": weaknesses[:4],
        "suggestions": suggestions[:4],
        "verdict": verdict,
    }


def clean_json_string(raw: str) -> str:
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'\s*```$', '', cleaned)
        cleaned = cleaned.strip()

    first_brace = cleaned.find("{")
    last_brace = cleaned.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        cleaned = cleaned[first_brace:last_brace + 1]
    return cleaned


def analyze_with_claude_llm(resume_text: str, job_description: str, rule_result: Dict[str, Any]) -> Dict[str, Any]:
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key or api_key == "your_anthropic_api_key_here":
        return rule_result

    prompt = f"""You are a Senior ATS Evaluation Engine and Executive Technical Recruiter.
Evaluate the candidate's resume against the target Job Description.

Candidate Resume Text:
\"\"\"
{resume_text}
\"\"\"

Target Job Description:
\"\"\"
{job_description}
\"\"\"

Base Ground-Truth Rule Checks:
- Matched Tech: {', '.join(rule_result['techStack']['matched']) or 'None'}
- Missing Tech: {', '.join(rule_result['techStack']['missing']) or 'None'}
- Sections Found: {', '.join(rule_result['sectionsFound']) or 'None'}
- Sections Missing: {', '.join(rule_result['sectionsMissing']) or 'None'}

INSTRUCTIONS:
1. Provide scores 0-100 for overallScore, matchScore, formattingScore, and structureScore.
2. Identify matched vs missing technical skills and keywords.
3. List 2-4 strengths, 2-4 weaknesses, and 3-5 suggestions.
4. Set verdict to exactly one of: "Strong match", "Moderate match", or "Weak match".
5. OUTPUT STRICT JSON ONLY. Do NOT include markdown code blocks or explanatory notes.

JSON Schema:
{{
  "overallScore": 82,
  "matchScore": 85,
  "formattingScore": 80,
  "structureScore": 80,
  "techStack": {{
    "matched": ["Python", "React"],
    "missing": ["Docker", "Kubernetes"]
  }},
  "keywords": {{
    "matched": ["REST APIs", "Agile"],
    "missing": ["CI/CD"]
  }},
  "sectionsFound": ["Contact Information", "Technical Skills", "Education", "Projects"],
  "sectionsMissing": ["Experience / Internships"],
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "suggestions": ["...", "..."],
  "verdict": "Strong match"
}}"""

    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
    }
    payload = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 1500,
        "temperature": 0.1,
        "messages": [{"role": "user", "content": prompt}]
    }

    def _call() -> str:
        resp = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        return data.get("content", [{}])[0].get("text", "")

    # First attempt with 1 retry
    for attempt in range(2):
        try:
            raw = _call()
            cleaned = clean_json_string(raw)
            parsed = json.loads(cleaned)
            return merge_results(parsed, rule_result)
        except Exception as e:
            if attempt == 1:
                return rule_result
            time.sleep(1)

    return rule_result


def merge_results(llm_res: Dict[str, Any], rule_res: Dict[str, Any]) -> Dict[str, Any]:
    def sanitize(val, fallback):
        try:
            num = int(val)
            return max(0, min(100, num))
        except:
            return fallback

    overall = sanitize(llm_res.get("overallScore"), rule_res["overallScore"])
    match = sanitize(llm_res.get("matchScore"), rule_res["matchScore"])
    formatting = sanitize(llm_res.get("formattingScore"), rule_res["formattingScore"])
    structure = sanitize(llm_res.get("structureScore"), rule_res["structureScore"])

    verdict = llm_res.get("verdict", "")
    if verdict in ["Strong match", "Strong"]:
        verdict = "Strong match" if overall >= 80 else ("Moderate match" if overall >= 60 else "Weak match")
    elif verdict in ["Weak match", "Weak"]:
        verdict = "Weak match"
    elif overall >= 80:
        verdict = "Strong match"
    elif overall < 60:
        verdict = "Weak match"
    else:
        verdict = "Moderate match"

    matched_tech = set(llm_res.get("techStack", {}).get("matched", []) + rule_res["techStack"]["matched"])
    missing_tech = set(llm_res.get("techStack", {}).get("missing", []) + rule_res["techStack"]["missing"])
    for m in matched_tech:
        missing_tech.discard(m)

    matched_kw = set(llm_res.get("keywords", {}).get("matched", []) + rule_res["keywords"]["matched"])
    missing_kw = set(llm_res.get("keywords", {}).get("missing", []) + rule_res["keywords"]["missing"])
    for m in matched_kw:
        missing_kw.discard(m)

    return {
        "overallScore": overall,
        "matchScore": match,
        "formattingScore": formatting,
        "structureScore": structure,
        "techStack": {
            "matched": list(matched_tech),
            "missing": list(missing_tech),
        },
        "keywords": {
            "matched": list(matched_kw),
            "missing": list(missing_kw),
        },
        "sectionsFound": llm_res.get("sectionsFound") or rule_res["sectionsFound"],
        "sectionsMissing": llm_res.get("sectionsMissing") or rule_res["sectionsMissing"],
        "strengths": llm_res.get("strengths") or rule_res["strengths"],
        "weaknesses": llm_res.get("weaknesses") or rule_res["weaknesses"],
        "suggestions": llm_res.get("suggestions") or rule_res["suggestions"],
        "verdict": verdict,
    }
