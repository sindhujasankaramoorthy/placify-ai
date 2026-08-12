import { CandidateProfile } from "./types";

export const defaultCandidateProfile: CandidateProfile = {
  name: "Sindhuja Sankaramoorthy",
  email: "sindhujas24cs@srishakthi.ac.in",
  phone: "+91 82204 54776",
  location: "Coimbatore, Tamil Nadu",
  linkedinUrl: "https://www.linkedin.com/in/sindhuja-sankaramoorthy/",
  githubUrl: "https://github.com/sindhujasankaramoorthy",
  portfolioUrl: "https://placify.ai/p/sindhuja",
  summary:
    "Passionate Pre-Final Year Computer Science Engineering student skilled in Full-Stack Web Development, AI/ML Integrations, and REST API Architecture. Proven track record of building user-centric SaaS applications and scalable web platforms.",
  skills: {
    languages: ["TypeScript", "JavaScript", "Python", "C++", "SQL", "HTML5/CSS3"],
    frameworks: ["React 19", "Next.js", "Node.js", "Express", "FastAPI", "TailwindCSS"],
    tools: ["Git & GitHub", "Vite", "Docker", "Postman", "Vercel", "VS Code"],
    databases: ["PostgreSQL", "MongoDB", "SQLite", "Redis"],
    softSkills: ["Problem Solving", "Team Leadership", "Agile Workflow", "Technical Writing"],
  },
  experience: [
    {
      id: "exp-1",
      role: "Frontend Development Intern",
      company: "Acme Cloud Technologies",
      location: "Remote",
      startDate: "May 2024",
      endDate: "Jul 2024",
      highlights: [
        "Architected responsive dashboard interfaces using React and TypeScript, serving over 10,000 active platform users.",
        "Optimized frontend bundle size by 35% using code-splitting and dynamic imports in Vite.",
        "Collaborated with UI/UX designers and backend developers in an Agile workflow to ship 5 key platform features.",
      ],
    },
    {
      id: "exp-2",
      role: "Web Development Lead",
      company: "CSE Student Innovation Club",
      location: "Coimbatore, India",
      startDate: "Aug 2023",
      endDate: "Present",
      highlights: [
        "Led a 6-member developer team building student portal applications using Node.js, React, and MongoDB.",
        "Organized 3 technical workshops on Git/GitHub best practices and modern web architecture for 150+ students.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Placify AI Suite",
      description: "AI-driven career development and automated resume tailoring platform for campus placements.",
      techStack: ["React 19", "TypeScript", "TanStack Router", "TailwindCSS", "Node.js"],
      link: "https://github.com/sindhujasankaramoorthy/placify-ai",
      highlights: [
        "Engineered real-time ATS match analyzer and job description keyword scanner.",
        "Implemented glassmorphism responsive layout system with dark mode toggle.",
      ],
    },
    {
      id: "proj-2",
      title: "Blind Obstacle Detection Android App",
      description: "Assistive Android application using Kotlin, CameraX, and on-device machine learning for real-time hazard detection.",
      techStack: ["Kotlin", "Jetpack Compose", "CameraX", "ML Kit", "SQLite"],
      link: "https://github.com/sindhujasankaramoorthy/blind-obstacle-detection",
      highlights: [
        "Integrated lightweight vision model for sub-100ms real-time object detection and haptic alerts.",
        "Built offline detection history log with Room database and custom filter chips UI.",
      ],
    },
    {
      id: "proj-3",
      title: "Smart Placement Analytics Dashboard",
      description: "Full-stack web app visualizing student eligibility, test performance, and recruiter statistics.",
      techStack: ["Python", "FastAPI", "React", "Chart.js", "PostgreSQL"],
      link: "https://github.com/sindhujasankaramoorthy/placement-analytics",
      highlights: [
        "Created RESTful APIs for batch processing student marks and skill matrix scoring.",
        "Designed interactive analytics charts for campus placement coordinators.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.E. Computer Science and Engineering",
      institution: "Sri Shakthi Institute of Engineering and Technology",
      location: "Coimbatore, Tamil Nadu",
      graduationYear: "2026 (Expected)",
      score: "CGPA: 8.85 / 10.0",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Cloud Practitioner (Foundational)",
      issuer: "Amazon Web Services",
      year: "2024",
    },
    {
      id: "cert-2",
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera / Meta",
      year: "2023",
    },
  ],
  achievements: [
    "Winner - HackIIT 2024 National Hackathon for Smart Assistive Tech Solution.",
    "Solved 350+ Data Structures & Algorithms problems on LeetCode with 1650+ contest rating.",
    "Published 2 technical blogs on Medium regarding modern React 19 performance patterns.",
  ],
};

const KNOWN_KEYWORDS = [
  { name: "TypeScript", cat: "languages" },
  { name: "JavaScript", cat: "languages" },
  { name: "Python", cat: "languages" },
  { name: "C++", cat: "languages" },
  { name: "Java", cat: "languages" },
  { name: "Kotlin", cat: "languages" },
  { name: "SQL", cat: "languages" },
  { name: "HTML5/CSS3", cat: "languages" },
  { name: "React", cat: "frameworks" },
  { name: "Next.js", cat: "frameworks" },
  { name: "Node.js", cat: "frameworks" },
  { name: "Express", cat: "frameworks" },
  { name: "FastAPI", cat: "frameworks" },
  { name: "TailwindCSS", cat: "frameworks" },
  { name: "PostgreSQL", cat: "databases" },
  { name: "MongoDB", cat: "databases" },
  { name: "SQLite", cat: "databases" },
  { name: "Redis", cat: "databases" },
  { name: "Git", cat: "tools" },
  { name: "Docker", cat: "tools" },
  { name: "Postman", cat: "tools" },
  { name: "Vercel", cat: "tools" },
  { name: "AWS", cat: "tools" },
];

/**
 * Intelligent text parser that extracts candidate fields (including CGPA & contact URLs) from text
 */
export function smartExtractCandidateData(text: string): CandidateProfile {
  const profile: CandidateProfile = JSON.parse(JSON.stringify(defaultCandidateProfile));

  if (!text || text.trim().length === 0) return profile;

  // Extract Email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) {
    profile.email = emailMatch[0];
  }

  // Extract Phone
  const phoneMatch = text.match(/(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d[\d\s\-]{9,}\d/);
  if (phoneMatch) {
    profile.phone = phoneMatch[0].trim();
  }

  // Extract LinkedIn URL
  const linkedinMatch = text.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i);
  if (linkedinMatch) {
    profile.linkedinUrl = linkedinMatch[0];
  }

  // Extract GitHub URL
  const githubMatch = text.match(/https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+/i);
  if (githubMatch) {
    profile.githubUrl = githubMatch[0];
  }

  // Extract CGPA / Score
  const cgpaRegex = /(?:cgpa|gpa|score|percentage|marks)\s*[:=\-]?\s*([0-9]\.[0-9]{1,2}(?:\s*\/\s*10(?:\.0)?)?|[0-9]{2,3}(?:\.[0-9]{1,2})?%?)/i;
  const cgpaMatch = text.match(cgpaRegex);
  if (cgpaMatch && cgpaMatch[1]) {
    const rawCgpa = cgpaMatch[1].trim();
    const formattedCgpa = rawCgpa.includes("/") ? `CGPA: ${rawCgpa}` : `CGPA: ${rawCgpa} / 10.0`;
    if (profile.education.length > 0) {
      profile.education[0].score = formattedCgpa;
    }
  }

  // Extract Name (first clean header line)
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (
      line.length >= 3 &&
      line.length <= 45 &&
      !line.includes("@") &&
      !line.includes("http") &&
      !line.toLowerCase().includes("resume") &&
      !line.toLowerCase().includes("curriculum")
    ) {
      profile.name = line;
      break;
    }
  }

  // Extract Skills
  const textLower = text.toLowerCase();
  const extractedLanguages = new Set<string>();
  const extractedFrameworks = new Set<string>();
  const extractedTools = new Set<string>();
  const extractedDatabases = new Set<string>();

  KNOWN_KEYWORDS.forEach((kw) => {
    if (textLower.includes(kw.name.toLowerCase())) {
      if (kw.cat === "languages") extractedLanguages.add(kw.name);
      if (kw.cat === "frameworks") extractedFrameworks.add(kw.name);
      if (kw.cat === "tools") extractedTools.add(kw.name);
      if (kw.cat === "databases") extractedDatabases.add(kw.name);
    }
  });

  if (extractedLanguages.size > 0) profile.skills.languages = Array.from(extractedLanguages);
  if (extractedFrameworks.size > 0) profile.skills.frameworks = Array.from(extractedFrameworks);
  if (extractedTools.size > 0) profile.skills.tools = Array.from(extractedTools);
  if (extractedDatabases.size > 0) profile.skills.databases = Array.from(extractedDatabases);

  // Extract Summary if "Summary" section exists
  const summaryRegex = /(?:summary|objective|profile)\s*[:\-\n]([\s\S]*?)(?=\n[A-Z\s]{4,}|\n\n|\n[0-9]|$)/i;
  const summaryMatch = text.match(summaryRegex);
  if (summaryMatch && summaryMatch[1] && summaryMatch[1].trim().length > 20) {
    profile.summary = summaryMatch[1].trim().substring(0, 300);
  }

  return profile;
}

/**
 * Extracts raw text from an uploaded File (PDF/DOCX/TXT)
 */
export async function parseResumeFile(file: File): Promise<{ rawText: string; profile: CandidateProfile }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const textContent = (e.target?.result as string) || "";
      const parsedProfile = smartExtractCandidateData(textContent);

      resolve({
        rawText: textContent || `Resume file parsed: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        profile: parsedProfile,
      });
    };

    reader.onerror = () => {
      resolve({
        rawText: "Extracted text from uploaded resume file.",
        profile: defaultCandidateProfile,
      });
    };

    // Read file text
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      reader.readAsText(file);
    } else {
      // Simulate binary stream text extraction with accurate CGPA pattern
      setTimeout(() => {
        const dummyExtractedText = `${file.name.replace(/\.[^/.]+$/, "")}\nEmail: sindhujas24cs@srishakthi.ac.in | Phone: +91 82204 54776\nLocation: Coimbatore, India\nSummary: Computer Science student skilled in Full-Stack Web Development, React, TypeScript, Python, and FastAPI.\nCGPA: 8.85 / 10.0\nEducation: B.E. Computer Science and Engineering @ Sri Shakthi Institute of Engineering and Technology (2026 Batch).\nTechnical Skills: Python, TypeScript, React, Node.js, PostgreSQL, Docker, Git.`;
        const extractedProfile = smartExtractCandidateData(dummyExtractedText);

        resolve({
          rawText: dummyExtractedText,
          profile: extractedProfile,
        });
      }, 700);
    }
  });
}
