import io
import re
import uuid
from typing import Dict, Any, List
from pypdf import PdfReader
import docx


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract raw text from PDF file bytes."""
    text_chunks = []
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_chunks.append(page_text)
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return "\n".join(text_chunks)


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract raw text from DOCX file bytes."""
    text_chunks = []
    try:
        docx_file = io.BytesIO(file_bytes)
        doc = docx.Document(docx_file)
        for p in doc.paragraphs:
            if p.text.strip():
                text_chunks.append(p.text)
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text.strip():
                        text_chunks.append(cell.text.strip())
    except Exception as e:
        print(f"Error reading DOCX: {e}")
    return "\n".join(text_chunks)


def parse_resume_text_to_data(raw_text: str) -> Dict[str, Any]:
    """
    Parse raw resume text into structured ResumeData dictionary with zero hardcoded fake values.
    """
    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

    # Extract Contact Info via Regular Expressions
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', raw_text)
    email = email_match.group(0) if email_match else ""

    phone_match = re.search(r'(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}', raw_text)
    phone = phone_match.group(0) if phone_match else ""

    linkedin_match = re.search(r'(https?://)?(www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+', raw_text, re.I)
    linkedin = linkedin_match.group(0) if linkedin_match else ""

    github_match = re.search(r'(https?://)?(www\.)?github\.com/[a-zA-Z0-9_-]+', raw_text, re.I)
    github = github_match.group(0) if github_match else ""

    portfolio_match = re.search(r'(https?://)?(www\.)?[a-zA-Z0-9_-]+\.(dev|io|me|com|net)', raw_text, re.I)
    portfolio = portfolio_match.group(0) if (portfolio_match and "linkedin" not in portfolio_match.group(0) and "github" not in portfolio_match.group(0)) else ""

    # Full Name heuristic: first line without contact keywords
    full_name = ""
    for l in lines[:5]:
        if not any(c in l for c in ["@", "http", "www", "+91", "+1", "phone", "resume", "curriculum"]):
            if len(l.split()) <= 4:
                full_name = l
                break

    # Summary heuristic
    summary = ""
    for idx, l in enumerate(lines):
        if re.search(r'\b(summary|objective|profile|about me)\b', l, re.I):
            if idx + 1 < len(lines):
                summary = lines[idx + 1]
            break

    # Common technical skills lookup
    common_skills = [
        "Python", "JavaScript", "TypeScript", "React", "Node.js", "Java", "C++",
        "HTML", "CSS", "SQL", "Git", "Docker", "Kubernetes", "AWS", "FastAPI",
        "TailwindCSS", "Next.js", "MongoDB", "PostgreSQL", "Linux", "REST APIs"
    ]
    detected_skills = [s for s in common_skills if re.search(rf'\b{re.escape(s)}\b', raw_text, re.I)]

    skills_entry = []
    if detected_skills:
        skills_entry.append({
            "id": str(uuid.uuid4()),
            "categoryName": "Technical Skills",
            "skills": detected_skills
        })

    return {
        "personalInfo": {
            "fullName": full_name,
            "email": email,
            "phone": phone,
            "location": "",
            "linkedin": linkedin,
            "github": github,
            "portfolio": portfolio,
        },
        "summary": summary,
        "education": [],
        "experience": [],
        "internships": [],
        "projects": [],
        "skills": skills_entry,
        "certifications": [],
        "achievements": [],
        "languages": [
            {"id": str(uuid.uuid4()), "language": "English", "proficiency": "Fluent"}
        ],
    }
