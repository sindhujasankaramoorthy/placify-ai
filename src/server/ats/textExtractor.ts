import { extractText as extractPdfText } from "unpdf";
import mammoth from "mammoth";

export async function extractTextFromPdfBuffer(buffer: Buffer | Uint8Array): Promise<string> {
  try {
    const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const result = await extractPdfText(uint8);
    if (typeof result === "string") return result;
    if (result && Array.isArray((result as any).text)) {
      return (result as any).text.join("\n");
    }
    if (result && typeof (result as any).text === "string") {
      return (result as any).text;
    }
    return String(result || "");
  } catch (err) {
    console.warn("[ATS TEXT] PDF extractText fallback:", err);
    return "";
  }
}

export async function extractTextFromDocxBuffer(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (err) {
    console.warn("[ATS TEXT] DOCX extractText error:", err);
    return "";
  }
}

export function formatResumeDataToText(data: any): string {
  if (!data || typeof data !== "object") return "";

  const sections: string[] = [];

  // 1. Personal / Candidate Info
  const p = data.personalInfo || data;
  const name = p.fullName || p.name || "";
  const email = p.email || "";
  const phone = p.phone || "";
  const location = p.location || "";
  const linkedin = p.linkedin || p.linkedinUrl || "";
  const github = p.github || p.githubUrl || "";
  const portfolio = p.portfolio || "";

  const contactLine = [name, email, phone, location, linkedin, github, portfolio]
    .filter(Boolean)
    .join(" | ");

  if (contactLine) sections.push(contactLine);

  // 2. Summary
  const summary = data.summary || p.summary;
  if (summary && typeof summary === "string" && summary.trim()) {
    sections.push(`PROFESSIONAL SUMMARY\n${summary.trim()}`);
  }

  // 3. Technical Skills
  const skills = data.skills;
  if (Array.isArray(skills)) {
    // Array of categories or strings
    const skillLines = skills.map((cat: any) => {
      if (typeof cat === "string") return cat;
      const catName = cat.categoryName || cat.category || "Skills";
      const list = Array.isArray(cat.skills) ? cat.skills.join(", ") : "";
      return `${catName}: ${list}`;
    });
    if (skillLines.length > 0) {
      sections.push(`TECHNICAL SKILLS\n${skillLines.join("\n")}`);
    }
  } else if (skills && typeof skills === "object") {
    // Skills object with languages, frameworks, etc.
    const skillLines = Object.entries(skills)
      .map(([cat, list]) => `${cat.toUpperCase()}: ${Array.isArray(list) ? list.join(", ") : String(list)}`)
      .filter(Boolean);
    if (skillLines.length > 0) {
      sections.push(`TECHNICAL SKILLS\n${skillLines.join("\n")}`);
    }
  }

  // 4. Experience & Internships
  const experience = [...(data.experience || []), ...(data.internships || [])];
  if (experience.length > 0) {
    const expLines = experience.map((exp: any) => {
      const title = exp.position || exp.role || "";
      const company = exp.company || "";
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" - ");
      const header = [title, company, dates].filter(Boolean).join(" | ");
      const bullets = Array.isArray(exp.bullets)
        ? exp.bullets.map((b: string) => `• ${b}`).join("\n")
        : Array.isArray(exp.highlights)
        ? exp.highlights.map((h: string) => `• ${h}`).join("\n")
        : "";
      return `${header}\n${bullets}`;
    });
    sections.push(`PROFESSIONAL EXPERIENCE & INTERNSHIPS\n${expLines.join("\n\n")}`);
  }

  // 5. Projects
  const projects = data.projects;
  if (Array.isArray(projects) && projects.length > 0) {
    const projLines = projects.map((proj: any) => {
      const title = proj.title || proj.name || "";
      const tech = Array.isArray(proj.technologies)
        ? `[Technologies: ${proj.technologies.join(", ")}]`
        : Array.isArray(proj.techStack)
        ? `[Tech: ${proj.techStack.join(", ")}]`
        : "";
      const desc = proj.description || "";
      const bullets = Array.isArray(proj.bullets)
        ? proj.bullets.map((b: string) => `• ${b}`).join("\n")
        : Array.isArray(proj.highlights)
        ? proj.highlights.map((h: string) => `• ${h}`).join("\n")
        : "";
      return `${title} ${tech}\n${desc}\n${bullets}`.trim();
    });
    sections.push(`TECHNICAL PROJECTS\n${projLines.join("\n\n")}`);
  }

  // 6. Education
  const education = data.education;
  if (Array.isArray(education) && education.length > 0) {
    const eduLines = education.map((edu: any) => {
      const degree = edu.degree || "";
      const inst = edu.institution || "";
      const dates = [edu.startDate, edu.endDate].filter(Boolean).join(" - ");
      const gpa = edu.gpa ? `GPA: ${edu.gpa}` : "";
      return [degree, inst, dates, gpa].filter(Boolean).join(" | ");
    });
    sections.push(`EDUCATION\n${eduLines.join("\n")}`);
  }

  // 7. Certifications & Achievements
  const certs = data.certifications;
  if (Array.isArray(certs) && certs.length > 0) {
    const certLines = certs.map((c: any) => {
      if (typeof c === "string") return `• ${c}`;
      return `• ${c.name || ""}${c.issuer ? ` - ${c.issuer}` : ""}`;
    });
    sections.push(`CERTIFICATIONS\n${certLines.join("\n")}`);
  }

  return sections.join("\n\n");
}
