import { ResumeData } from "@/types/resume";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000/api/v1";

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("placify_auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export interface ApiResumeResponse {
  id: number;
  user_id: number;
  title: string;
  template_id: string;
  content: ResumeData;
  ats_score: number;
  created_at: string;
  updated_at: string;
}

export interface ATSAnalysisResult {
  ats_score: number;
  keywords: string[];
  missing_skills: string[];
  feedback: { type: "pass" | "warning"; message: string }[];
}

const LOCAL_SAVED_RESUMES_KEY = "placify_saved_resumes";

function getLocalSavedResumes(): ApiResumeResponse[] {
  try {
    const raw = localStorage.getItem(LOCAL_SAVED_RESUMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalResumes(items: ApiResumeResponse[]): void {
  try {
    localStorage.setItem(LOCAL_SAVED_RESUMES_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to write to localStorage:", err);
  }
}

export async function fetchUserResumes(): Promise<ApiResumeResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      const data: ApiResumeResponse[] = await response.json();
      saveLocalResumes(data);
      return data;
    }
    throw new Error(`Server returned ${response.status}`);
  } catch (error) {
    console.warn("FastAPI backend not reachable, fetching from local storage:", error);
    return getLocalSavedResumes();
  }
}

export async function fetchResumeById(id: number | string): Promise<ApiResumeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn(`FastAPI backend unreachable for fetchResumeById #${id}:`, err);
  }

  const localItems = getLocalSavedResumes();
  const found = localItems.find((item) => String(item.id) === String(id));
  if (found) return found;

  throw new Error(`Failed to fetch resume #${id}`);
}

export async function createResume(payload: {
  title: string;
  template_id: string;
  content: ResumeData;
}): Promise<ApiResumeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const created: ApiResumeResponse = await response.json();
      const localItems = getLocalSavedResumes().filter((item) => item.id !== created.id);
      saveLocalResumes([created, ...localItems]);
      return created;
    }
  } catch (err) {
    console.warn("FastAPI backend unreachable, saving resume locally:", err);
  }

  // Local storage fallback creation
  const now = new Date().toISOString();
  const localObj: ApiResumeResponse = {
    id: Date.now(),
    user_id: 1,
    title: payload.title || "Untitled Resume",
    template_id: payload.template_id || "modern",
    content: payload.content,
    ats_score: 0,
    created_at: now,
    updated_at: now,
  };

  const localItems = getLocalSavedResumes();
  saveLocalResumes([localObj, ...localItems]);
  return localObj;
}

export async function updateResume(
  id: number | string,
  payload: {
    title?: string;
    template_id?: string;
    content?: ResumeData;
    ats_score?: number;
  }
): Promise<ApiResumeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const updated: ApiResumeResponse = await response.json();
      const localItems = getLocalSavedResumes().map((item) => (String(item.id) === String(id) ? updated : item));
      saveLocalResumes(localItems);
      return updated;
    }
  } catch (err) {
    console.warn(`FastAPI backend unreachable for updateResume #${id}:`, err);
  }

  // Local storage fallback update
  const localItems = getLocalSavedResumes();
  const idx = localItems.findIndex((item) => String(item.id) === String(id));
  const now = new Date().toISOString();

  let target: ApiResumeResponse;
  if (idx !== -1) {
    target = {
      ...localItems[idx],
      title: payload.title ?? localItems[idx].title,
      template_id: payload.template_id ?? localItems[idx].template_id,
      content: payload.content ?? localItems[idx].content,
      ats_score: payload.ats_score ?? localItems[idx].ats_score,
      updated_at: now,
    };
    localItems[idx] = target;
  } else {
    target = {
      id: typeof id === "number" ? id : Date.now(),
      user_id: 1,
      title: payload.title || "Untitled Resume",
      template_id: payload.template_id || "modern",
      content: payload.content || ({} as ResumeData),
      ats_score: payload.ats_score || 0,
      created_at: now,
      updated_at: now,
    };
    localItems.unshift(target);
  }

  saveLocalResumes(localItems);
  return target;
}

export async function deleteResume(id: number | string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch (err) {
    console.warn(`FastAPI backend unreachable for deleteResume #${id}:`, err);
  }

  const localItems = getLocalSavedResumes().filter((item) => String(item.id) !== String(id));
  saveLocalResumes(localItems);
}

/**
 * Upload an existing PDF or DOCX file to FastAPI parser endpoint and receive extracted ResumeData.
 */
export async function parseResumeFile(file: File): Promise<ResumeData> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  const token = localStorage.getItem("placify_auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/resumes/parse-file`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to parse document: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    console.warn("FastAPI parser endpoint error or unreachable:", err);
    // If backend returns a specific HTTP error detail, rethrow it
    if (err.message && !err.message.includes("Failed to fetch") && !err.message.includes("NetworkError") && !err.message.includes("fetch")) {
      throw err;
    }
    // Client-side fallback text parsing for resume files when backend is offline
    try {
      return await clientSideParseFile(file);
    } catch {
      throw new Error("Unable to connect to FastAPI backend at http://localhost:8000. Please ensure the backend server is running.");
    }
  }
}

/**
 * Client-side text parsing fallback when FastAPI backend is offline.
 */
async function clientSideParseFile(file: File): Promise<ResumeData> {
  const text = await file.text().catch(() => "");
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);

  const fullName = lines.find(l => !l.includes("@") && !l.includes("http") && l.split(" ").length <= 4) || file.name.replace(/\.[^/.]+$/, "");

  return {
    personalInfo: {
      fullName,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: lines.slice(0, 3).join(" "),
    education: [],
    experience: [],
    internships: [],
    projects: [],
    skills: [{ id: "fallback-skills", categoryName: "Skills", skills: ["Extracted Content"] }],
    certifications: [],
    achievements: [],
    languages: [],
  };
}

/**
 * Analyze current ResumeData for dynamic ATS score, keywords, and feedback items.
 */
export async function analyzeResumeATS(content: ResumeData): Promise<ATSAnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes/analyze-ats`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(content),
    });
    if (!response.ok) {
      throw new Error(`ATS analysis failed: ${response.statusText}`);
    }
    return await response.json();
  } catch {
    // Client-side dynamic ATS analysis fallback if backend is offline
    return clientSideATSFallback(content);
  }
}

export interface AITailorResult {
  tailored_content: ResumeData;
  ats_analysis: ATSAnalysisResult;
}

/**
 * Generate an improved, job-tailored resume based on user's target role and current resume data.
 * Recalculates the ATS score dynamically from the generated content.
 */
export async function generateAITailoredResume(
  content: ResumeData,
  targetRole: string
): Promise<AITailorResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes/generate-ai-tailored`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        content,
        target_role: targetRole,
      }),
    });
    if (!response.ok) {
      throw new Error(`AI Tailoring failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.warn("Backend AI Tailor endpoint unreachable, running client fallback tailor:", err);
    return clientSideAITailor(content, targetRole);
  }
}

function clientSideAITailor(content: ResumeData, targetRole: string): AITailorResult {
  const tailored: ResumeData = JSON.parse(JSON.stringify(content));
  const summary = tailored.summary?.trim() || "";
  
  if (summary) {
    tailored.summary = `Results-driven technical professional targeting ${targetRole} roles. ${summary} Focused on delivering scalable software solutions and high-performance technical architectures.`;
  } else {
    tailored.summary = `Motivated software professional targeting ${targetRole} opportunities with expertise in technical problem-solving and software development.`;
  }

  const actionVerbs = ["Engineered", "Architected", "Optimized", "Developed", "Automated", "Scaled", "Built"];
  let verbIdx = 0;
  for (const exp of tailored.experience || []) {
    exp.bullets = (exp.bullets || []).map((b) => {
      const verb = actionVerbs[verbIdx++ % actionVerbs.length];
      const clean = b.trim();
      return clean.length > 0 ? `${verb} ${clean.charAt(0).toLowerCase()}${clean.slice(1)}` : clean;
    });
  }

  const ats = clientSideATSFallback(tailored);
  return {
    tailored_content: tailored,
    ats_analysis: ats,
  };
}

const INDUSTRY_KEYWORDS = [
  "Docker", "Kubernetes", "GraphQL", "CI/CD", "REST APIs", "Redis",
  "Microservices", "Python", "React", "TypeScript", "SQL", "Git",
  "FastAPI", "TailwindCSS", "Node.js", "AWS", "System Design"
];

const ACTION_VERBS = [
  "built", "developed", "designed", "engineered", "implemented",
  "led", "optimized", "architected", "refactored", "delivered",
  "increased", "reduced", "scaled", "automated", "created"
];

function clientSideATSFallback(content: ResumeData): ATSAnalysisResult {
  const p = content.personalInfo || {};
  const summary = content.summary || "";
  const education = content.education || [];
  const experience = content.experience || [];
  const internships = content.internships || [];
  const projects = content.projects || [];
  const skillsCat = content.skills || [];
  const certifications = content.certifications || [];

  let score = 0;
  const feedback: { type: "pass" | "warning"; message: string }[] = [];

  // Contact Info
  if (p.fullName) score += 5;
  else feedback.push({ type: "warning", message: "Missing full name in personal information." });

  if (p.email) score += 5;
  else feedback.push({ type: "warning", message: "Missing email address." });

  if (p.phone) score += 5;
  else feedback.push({ type: "warning", message: "Missing phone number." });

  if (p.linkedin || p.github || p.portfolio) {
    score += 5;
    feedback.push({ type: "pass", message: "Online profiles / Portfolio linked." });
  } else {
    feedback.push({ type: "warning", message: "Add a LinkedIn or GitHub link for higher ATS score." });
  }

  // Summary
  if (summary && summary.trim().length >= 30) {
    score += 15;
    feedback.push({ type: "pass", message: "Strong professional summary included." });
  } else if (summary) {
    score += 8;
    feedback.push({ type: "warning", message: "Summary is brief; consider expanding career overview." });
  } else {
    feedback.push({ type: "warning", message: "Add a professional summary section." });
  }

  // Work Experience
  const allExp = [...experience, ...internships];
  if (allExp.length > 0) {
    score += 15;
    let hasVerbs = false;
    let hasNumbers = false;

    for (const exp of allExp) {
      for (const bullet of exp.bullets || []) {
        const lower = bullet.toLowerCase();
        if (ACTION_VERBS.some(v => lower.includes(v))) hasVerbs = true;
        if (/(\d+%|\d+\+|\$\d+|\d+\s?(users|ms|sec|x))/.test(lower)) hasNumbers = true;
      }
    }

    if (hasVerbs) {
      score += 5;
      feedback.push({ type: "pass", message: "Strong action verbs detected in bullet points." });
    } else {
      feedback.push({ type: "warning", message: "Use strong action verbs (e.g. Developed, Led, Optimized)." });
    }

    if (hasNumbers) {
      score += 5;
      feedback.push({ type: "pass", message: "Quantified impact & metrics included in experience." });
    } else {
      feedback.push({ type: "warning", message: "Add metric numbers or percentage metrics to bullet points." });
    }
  } else {
    feedback.push({ type: "warning", message: "No work experience or internship entries listed." });
  }

  // Education
  if (education.length > 0) {
    score += 15;
    feedback.push({ type: "pass", message: "Education credentials verified." });
  } else {
    feedback.push({ type: "warning", message: "Add education history or degree information." });
  }

  // Skills
  const userSkills = new Set<string>();
  for (const cat of skillsCat) {
    for (const s of cat.skills || []) {
      if (s.trim()) userSkills.add(s.trim().toLowerCase());
    }
  }

  if (userSkills.size >= 5) {
    score += 15;
    feedback.push({ type: "pass", message: `Good skills coverage (${userSkills.size} skills listed).` });
  } else if (userSkills.size > 0) {
    score += 8;
    feedback.push({ type: "warning", message: "Add more relevant technical skills." });
  } else {
    feedback.push({ type: "warning", message: "No skills listed." });
  }

  // Projects & Certifications
  if (projects.length > 0 || certifications.length > 0) {
    score += 10;
    feedback.push({ type: "pass", message: "Projects / Certifications showcased." });
  } else {
    feedback.push({ type: "warning", message: "Include projects or certifications." });
  }

  // Dynamic Keyword Matching
  const contentStr = JSON.stringify(content).toLowerCase();
  const presentKeywords: string[] = [];
  const missingSkills: string[] = [];

  for (const kw of INDUSTRY_KEYWORDS) {
    if (userSkills.has(kw.toLowerCase()) || contentStr.includes(kw.toLowerCase())) {
      presentKeywords.push(kw);
    } else {
      missingSkills.push(kw);
    }
  }

  return {
    ats_score: Math.min(score, 100),
    keywords: presentKeywords.slice(0, 8),
    missing_skills: missingSkills.slice(0, 4),
    feedback,
  };
}
