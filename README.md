# 🚀 Placify AI — Next-Gen Campus Placement & AI Resume Studio

<div align="center">

![Placify AI Banner](https://img.shields.io/badge/Placify%20AI-Resume%20Studio-6366f1?style=for-the-badge&logo=sparkles&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-v19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TanStack Start](https://img.shields.io/badge/TanStack%20Start-SSR-ff4154?style=for-the-badge&logo=react-router&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.11-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4.2-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ATS Score](https://img.shields.io/badge/ATS%20Optimized-Score%2095%2B-10b981?style=for-the-badge&logo=checkmarx&logoColor=white)

<p align="center">
  <strong>An intelligent, end-to-end recruitment preparation platform featuring 10 ATS-optimized resume templates, live GitHub/LeetCode verification, anti-fabrication JD tailoring, and a FastAPI machine learning backend.</strong>
</p>

[Key Features](#-key-features) • [Architecture](#-architecture) • [Templates](#-10-ats-optimized-templates) • [Getting Started](#-getting-started) • [API Reference](#-backend-api-reference)

---

</div>

## 🌟 Overview

**Placify AI** bridges the gap between candidate qualifications and technical recruiters. Unlike generic resume generators that fabricate unverified claims, Placify incorporates an **Anti-Fabrication Engine** that anchors resume tailoring strictly against verified developer metrics (GitHub commits, top repos, LeetCode solved problems) and the candidate's authentic career profile.

---

## ⚡ Key Features

### 1. 📄 10 Professional ATS-Optimized Templates
- **Instant Template Switching**: Seamlessly toggle between 10 layouts without losing or re-entering data.
- **ATS Parsability**: Engineered with clean semantics, structured hierarchy, and optimal font pairings yielding a **95+ ATS score**.
- **A4 PDF Export**: High-resolution, multi-page vector PDF generation using `html2pdf.js` with zero margin bleed and graceful high-definition print fallback.

### 2. ✍️ Modular Accordion Section Editor
- **10 Dedicated Forms**: Personal Information, Summary, Education, Work Experience, Internships, Projects, Categorized Skills, Certifications, Achievements, and Languages.
- **Real-Time Live Preview**: Instant client-side re-rendering as you type.

### 3. 🎯 Real-Time ATS Audit & Keyword Analyzer
- **Dynamic 0–100 Score Meter**: Evaluates section completeness, bullet verb impact, and keyword density.
- **Automated Recommendations**: Color-coded checklists flagging missing contact items, weak action verbs, and recommended industry keywords.
- **Missing Skills Detection**: Identifies gaps between your resume and standard industry expectations.

### 4. 🤖 AI Role Tailoring Engine
- **Target Role Optimization**: Optimize phrasing and skill groupings for roles like *Cloud Engineer*, *Full Stack Developer*, *DevOps Engineer*, *Backend Architect*, and *Data Scientist*.
- **Anti-Fabrication Guardrails**: Never hallucinates false companies, fictitious degrees, or unearned credentials. Powered by Google Gemini with offline rule-engine fallbacks.

### 5. 🔗 Live GitHub & LeetCode Profile Verification
- **GitHub Integration**: Fetches public repositories, star counts, primary languages, and verified commits.
- **LeetCode Integration**: Pulls live problem-solving stats (Easy, Medium, Hard breakdown) to showcase algorithmic proficiency.

### 6. 💼 Campus Jobs Directory & Anti-Fabrication Matcher
- **Job Description Parsing**: Match campus placement listings and internship requirements against candidate skills.
- **Anti-Fabrication Match Modal**: Compares candidate achievements directly against JD bullet points with transparent match percentages.

### 7. 💾 Multi-Version Draft Manager
- **Version Control**: Create new blank drafts, load previous resume versions, and delete obsolete iterations.
- **Offline Resiliency**: Dual-layer synchronization supporting offline `localStorage` and REST database persistence.

---

## 🎨 10 ATS-Optimized Templates

| Template ID | Name | Category | Best Suited For |
|---|---|---|---|
| `modern-pro` | **Modern Professional** | Modern | General software engineers & campus grads |
| `ats-classic` | **ATS Classic / Clean** | Classic | Strict enterprise & banking ATS portals |
| `minimalist` | **Minimalist Elite** | Modern | Clean, high-whitespace aesthetic |
| `student-fresher`| **Student & Fresher** | Modern | Internships & academic-first profiles |
| `tech-developer` | **Technical Developer** | Technical | Systems, Backend & DevOps programmers (Terminal theme) |
| `creative-pro` | **Creative Professional**| Creative | Full-stack designers & UI/UX developers |
| `corporate-exec` | **Corporate Executive** | Executive | Engineering managers & tech leads |
| `two-column-modern`| **Two-Column Modern** | Creative | Profiles with extensive skill taxonomies |
| `academic` | **Academic & Research** | Classic | PhD scholars, research fellows, & papers |
| `compact-pro` | **Compact Professional**| Executive | Dense 1-page format for 5+ years experience |

---

## 🏗️ Architecture

```
placify-ai/
├── backend/                        # FastAPI REST API Backend
│   ├── app/
│   │   ├── api/v1/endpoints/       # Resume CRUD, Parse, Tailor & ATS endpoints
│   │   ├── core/config.py          # App settings & environment config
│   │   ├── db/session.py           # SQLAlchemy SQLite / PostgreSQL engine
│   │   ├── models/                 # Resume & User ORM database models
│   │   ├── schemas/                # Pydantic v2 schemas & validations
│   │   ├── services/               # ATS Analyzer, AI Tailoring, PDF Parser
│   │   └── main.py                 # FastAPI application with CORS
│   └── requirements.txt            # Python dependencies
│
├── src/                            # React 19 Frontend (TanStack Start SSR)
│   ├── components/
│   │   ├── resume/
│   │   │   ├── sections/           # 10 Accordion Section Editor forms
│   │   │   ├── templates/          # 10 Resume Templates & TemplateRegistry
│   │   │   ├── AITailorCard.tsx    # Role tailoring interface
│   │   │   ├── ATSFeedbackPanel.tsx# Live score meter & keywords
│   │   │   ├── ResumeBuilderContainer.tsx # Main builder workspace
│   │   │   ├── ResumeListDialog.tsx# Saved resumes modal
│   │   │   ├── ResumePreview.tsx   # Live A4 document wrapper
│   │   │   ├── ResumeUploadCard.tsx# PDF/DOCX document parser card
│   │   │   └── TemplateSelector.tsx# 10-template visual selector dialog
│   │   └── ui/                     # Accessible UI components (Radix + Tailwind)
│   ├── lib/
│   │   ├── api/resume.ts           # Client API layer with offline localStorage
│   │   ├── pdf/exportResumePdf.ts  # A4 PDF exporter engine
│   │   └── resume/                 # Base parser, profile fetcher, excel engine
│   ├── routes/
│   │   ├── dashboard.resume.tsx    # Unified 5-step Resume AI Studio route
│   │   ├── dashboard.jobs.tsx      # Campus job listings route
│   │   └── dashboard.analyzer.tsx  # Standalone resume scanner
│   └── types/
│       └── resume.ts               # Shared TypeScript data models & converters
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0 or newer
- **Python**: v3.10 or newer (for optional local FastAPI backend)
- **Package Manager**: `npm` or `bun`

### 1. Frontend Setup

```bash
# Clone the repository
git clone https://github.com/sindhujasankaramoorthy/placify-ai.git
cd placify-ai

# Install dependencies
npm install

# Launch the development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) (or the port specified in terminal) in your browser.

### 2. Backend Setup (Optional)

The frontend features built-in client-side and `localStorage` fallbacks so it works completely offline out of the box. To launch the companion FastAPI server:

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```

Interactive Swagger API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📡 Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/resumes` | List all saved resumes for the user |
| `POST` | `/api/v1/resumes` | Create a new resume version |
| `GET` | `/api/v1/resumes/{id}` | Retrieve a specific resume by ID |
| `PUT` | `/api/v1/resumes/{id}` | Update title, template, or content |
| `DELETE`| `/api/v1/resumes/{id}` | Delete a saved resume |
| `POST` | `/api/v1/resumes/parse-file` | Extract structured data from uploaded PDF/DOCX |
| `POST` | `/api/v1/resumes/analyze-ats` | Calculate ATS score, keywords, and feedback |
| `POST` | `/api/v1/resumes/tailor` | Generate targeted role phrasing and metric bullets |
| `GET` | `/health` | Healthcheck probe |
