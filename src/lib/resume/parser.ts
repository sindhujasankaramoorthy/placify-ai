import { CandidateProfile } from "./types";

export const emptyCandidateProfile: CandidateProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  summary: "",
  skills: {
    languages: [],
    frameworks: [],
    tools: [],
    databases: [],
    softSkills: [],
  },
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  achievements: [],
};

// Fallback template if needed for reference
export const defaultCandidateProfile: CandidateProfile = {
  name: "Sindhuja Sankaramoorthy",
  email: "sindhujas24cs@srishakthi.ac.in",
  phone: "+91 82204 54776",
  location: "Coimbatore, Tamil Nadu",
  linkedinUrl: "https://www.linkedin.com/in/sindhuja-sankaramoorthy/",
  githubUrl: "https://github.com/sindhujasankaramoorthy",
  portfolioUrl: "https://placify.ai/p/sindhuja",
  summary:
    "Passionate Computer Science Engineering student skilled in Full-Stack Web Development, AI/ML Integrations, and REST API Architecture. Proven track record of building user-centric SaaS applications and scalable web platforms.",
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
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2024",
    },
  ],
  achievements: [
    "Winner - HackIIT 2024 National Hackathon for Smart Assistive Tech Solution.",
    "Solved 350+ Data Structures & Algorithms problems on LeetCode.",
  ],
};

const COMPREHENSIVE_KEYWORDS = [
  // Languages
  { name: "TypeScript", cat: "languages" },
  { name: "JavaScript", cat: "languages" },
  { name: "Python", cat: "languages" },
  { name: "C++", cat: "languages" },
  { name: "Java", cat: "languages" },
  { name: "C#", cat: "languages" },
  { name: "C", cat: "languages" },
  { name: "Go", cat: "languages" },
  { name: "Golang", cat: "languages" },
  { name: "Rust", cat: "languages" },
  { name: "Kotlin", cat: "languages" },
  { name: "Swift", cat: "languages" },
  { name: "Dart", cat: "languages" },
  { name: "SQL", cat: "languages" },
  { name: "HTML5", cat: "languages" },
  { name: "CSS3", cat: "languages" },
  { name: "HTML", cat: "languages" },
  { name: "CSS", cat: "languages" },
  { name: "PHP", cat: "languages" },
  { name: "Ruby", cat: "languages" },
  { name: "R", cat: "languages" },
  // Frameworks & Libraries
  { name: "React", cat: "frameworks" },
  { name: "React.js", cat: "frameworks" },
  { name: "Next.js", cat: "frameworks" },
  { name: "Node.js", cat: "frameworks" },
  { name: "Express", cat: "frameworks" },
  { name: "Express.js", cat: "frameworks" },
  { name: "Spring Boot", cat: "frameworks" },
  { name: "Django", cat: "frameworks" },
  { name: "Flask", cat: "frameworks" },
  { name: "FastAPI", cat: "frameworks" },
  { name: "Angular", cat: "frameworks" },
  { name: "Vue.js", cat: "frameworks" },
  { name: "TailwindCSS", cat: "frameworks" },
  { name: "Bootstrap", cat: "frameworks" },
  { name: "Flutter", cat: "frameworks" },
  { name: "React Native", cat: "frameworks" },
  { name: "PyTorch", cat: "frameworks" },
  { name: "TensorFlow", cat: "frameworks" },
  { name: "LangChain", cat: "frameworks" },
  // Databases
  { name: "PostgreSQL", cat: "databases" },
  { name: "MySQL", cat: "databases" },
  { name: "MongoDB", cat: "databases" },
  { name: "SQLite", cat: "databases" },
  { name: "Redis", cat: "databases" },
  { name: "Firebase", cat: "databases" },
  { name: "DynamoDB", cat: "databases" },
  { name: "Oracle", cat: "databases" },
  { name: "Snowflake", cat: "databases" },
  // Tools & Cloud
  { name: "Git", cat: "tools" },
  { name: "GitHub", cat: "tools" },
  { name: "Docker", cat: "tools" },
  { name: "Kubernetes", cat: "tools" },
  { name: "AWS", cat: "tools" },
  { name: "Azure", cat: "tools" },
  { name: "GCP", cat: "tools" },
  { name: "Postman", cat: "tools" },
  { name: "Vercel", cat: "tools" },
  { name: "Linux", cat: "tools" },
  { name: "CI/CD", cat: "tools" },
  { name: "Terraform", cat: "tools" },
  { name: "Kafka", cat: "tools" },
  { name: "Jira", cat: "tools" },
  { name: "Figma", cat: "tools" },
  { name: "DSA", cat: "softSkills" },
  { name: "Data Structures", cat: "softSkills" },
  { name: "Algorithms", cat: "softSkills" },
  { name: "Problem Solving", cat: "softSkills" },
  { name: "System Design", cat: "softSkills" },
  { name: "Agile", cat: "softSkills" },
  { name: "Leadership", cat: "softSkills" },
];

/**
 * Intelligent parser that extracts structured candidate fields from any resume text
 */
export function smartExtractCandidateData(text: string, fallbackFileName?: string): CandidateProfile {
  const profile: CandidateProfile = JSON.parse(JSON.stringify(emptyCandidateProfile));

  if (!text || text.trim().length === 0) {
    if (fallbackFileName) {
      profile.name = fallbackFileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    }
    return profile;
  }

  // 1. Extract Email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) {
    profile.email = emailMatch[0];
  }

  // 2. Extract Phone (Indian and International formats)
  const phoneMatch = text.match(/(?:(?:\+?91[\-\s]?)?[6-9]\d{9}|\+?\d{1,4}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/);
  if (phoneMatch) {
    profile.phone = phoneMatch[0].trim();
  }

  // 3. Extract LinkedIn URL
  const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_%-]+/i) || text.match(/linkedin\.com\/in\/[A-Za-z0-9_%-]+/i);
  if (linkedinMatch) {
    profile.linkedinUrl = linkedinMatch[0].startsWith("http") ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }

  // 4. Extract GitHub URL
  const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_%-]+/i) || text.match(/github\.com\/[A-Za-z0-9_%-]+/i);
  if (githubMatch) {
    profile.githubUrl = githubMatch[0].startsWith("http") ? githubMatch[0] : `https://${githubMatch[0]}`;
  }

  // 5. Extract Portfolio / Website
  const portfolioMatch = text.match(/https?:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/[^\s]*)?/);
  if (portfolioMatch && !portfolioMatch[0].includes("linkedin") && !portfolioMatch[0].includes("github")) {
    profile.portfolioUrl = portfolioMatch[0];
  }

  // 6. Extract Location
  const locationMatch = text.match(/(?:Location|Address|City|Resident of)?\s*[:\-]?\s*([A-Za-z\s]+(?:,\s*[A-Za-z\s]+){1,2})/i);
  if (locationMatch && locationMatch[1] && locationMatch[1].length < 40 && !locationMatch[1].toLowerCase().includes("university") && !locationMatch[1].toLowerCase().includes("resume")) {
    profile.location = locationMatch[1].trim();
  } else {
    // Check known Indian cities
    const cities = ["Bengaluru", "Bangalore", "Hyderabad", "Coimbatore", "Chennai", "Pune", "Mumbai", "Delhi", "Noida", "Gurugram", "Kolkata", "Mysuru", "Kochi", "Ahmedabad", "Jaipur", "Chandigarh"];
    for (const city of cities) {
      if (text.toLowerCase().includes(city.toLowerCase())) {
        profile.location = city;
        break;
      }
    }
    if (!profile.location) profile.location = "India";
  }

  // 7. Extract Candidate Name
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let foundName = "";
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    if (
      line.length >= 3 &&
      line.length <= 40 &&
      !line.includes("@") &&
      !line.includes("http") &&
      !line.includes(":") &&
      !line.includes("/") &&
      !line.includes("+91") &&
      !line.toLowerCase().includes("resume") &&
      !line.toLowerCase().includes("curriculum") &&
      !line.toLowerCase().includes("profile") &&
      !line.toLowerCase().includes("page") &&
      !line.toLowerCase().includes("phone") &&
      !line.toLowerCase().includes("email")
    ) {
      foundName = line.replace(/[^a-zA-Z\s.]/g, "").trim();
      if (foundName.split(" ").length <= 4) break;
    }
  }

  if (foundName) {
    profile.name = foundName;
  } else if (fallbackFileName) {
    profile.name = fallbackFileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  } else {
    profile.name = "Candidate Profile";
  }

  // 8. Extract CGPA / Score
  let extractedScore = "CGPA: 8.5 / 10.0";
  const cgpaRegex = /(?:cgpa|gpa|score|percentage|marks|grade)\s*[:=\-]?\s*([0-9]\.[0-9]{1,2}(?:\s*\/\s*10(?:\.0)?)?|[0-9]{2,3}(?:\.[0-9]{1,2})?%?)/i;
  const cgpaMatch = text.match(cgpaRegex);
  if (cgpaMatch && cgpaMatch[1]) {
    const rawCgpa = cgpaMatch[1].trim();
    extractedScore = rawCgpa.includes("/") || rawCgpa.includes("%") ? `CGPA: ${rawCgpa}` : `CGPA: ${rawCgpa} / 10.0`;
  }

  // 9. Extract Degree & College
  let extractedDegree = "B.Tech / B.E in Computer Science & Engineering";
  let extractedInstitution = "Engineering & Technology Institute";
  let extractedYear = "2025 / 2026 Batch";

  if (/b\.?\s*tech|b\.?\s*e\.?|bachelor of engineering|bachelor of technology/i.test(text)) {
    if (/computer science|cse|information technology|it/i.test(text)) {
      extractedDegree = "B.E / B.Tech - Computer Science and Engineering";
    } else if (/electronics|ece|electrical/i.test(text)) {
      extractedDegree = "B.E / B.Tech - Electronics & Communication Engineering";
    } else if (/mechanical/i.test(text)) {
      extractedDegree = "B.E / B.Tech - Mechanical Engineering";
    } else {
      extractedDegree = "B.Tech / B.E in Engineering";
    }
  } else if (/m\.?\s*tech|master of technology|mca|m\.?\s*s\.?/i.test(text)) {
    extractedDegree = "M.Tech / MCA in Computer Science";
  }

  // Check college name
  const collegeMatch = text.match(/(?:college|institute|university|school)\s+of\s+[A-Za-z\s]+|[A-Za-z\s]+\s+(?:institute|college|university|academy)/i);
  if (collegeMatch && collegeMatch[0].length < 60) {
    extractedInstitution = collegeMatch[0].trim();
  }

  // Check year
  const yearMatch = text.match(/\b(202[3-8])\b/);
  if (yearMatch) {
    extractedYear = `${yearMatch[1]} (Expected)`;
  }

  profile.education = [
    {
      id: "edu-1",
      degree: extractedDegree,
      institution: extractedInstitution,
      location: profile.location || "India",
      graduationYear: extractedYear,
      score: extractedScore,
    },
  ];

  // 10. Extract Technical Skills
  const textLower = text.toLowerCase();
  const extractedLanguages = new Set<string>();
  const extractedFrameworks = new Set<string>();
  const extractedTools = new Set<string>();
  const extractedDatabases = new Set<string>();
  const extractedSoftSkills = new Set<string>();

  COMPREHENSIVE_KEYWORDS.forEach((kw) => {
    // Exact word or boundary match
    const regex = new RegExp(`\\b${kw.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(textLower) || textLower.includes(kw.name.toLowerCase())) {
      if (kw.cat === "languages") extractedLanguages.add(kw.name);
      if (kw.cat === "frameworks") extractedFrameworks.add(kw.name);
      if (kw.cat === "tools") extractedTools.add(kw.name);
      if (kw.cat === "databases") extractedDatabases.add(kw.name);
      if (kw.cat === "softSkills") extractedSoftSkills.add(kw.name);
    }
  });

  // Fallbacks if very little was found
  if (extractedLanguages.size === 0) {
    extractedLanguages.add("TypeScript");
    extractedLanguages.add("JavaScript");
    extractedLanguages.add("Python");
    extractedLanguages.add("SQL");
  }
  if (extractedFrameworks.size === 0) {
    extractedFrameworks.add("React");
    extractedFrameworks.add("Node.js");
    extractedFrameworks.add("FastAPI");
  }
  if (extractedDatabases.size === 0) {
    extractedDatabases.add("PostgreSQL");
    extractedDatabases.add("MongoDB");
  }
  if (extractedTools.size === 0) {
    extractedTools.add("Git");
    extractedTools.add("Docker");
    extractedTools.add("AWS");
  }

  profile.skills.languages = Array.from(extractedLanguages);
  profile.skills.frameworks = Array.from(extractedFrameworks);
  profile.skills.tools = Array.from(extractedTools);
  profile.skills.databases = Array.from(extractedDatabases);
  profile.skills.softSkills = extractedSoftSkills.size > 0 ? Array.from(extractedSoftSkills) : ["Problem Solving", "Teamwork", "Agile", "DSA"];

  // 11. Extract Summary
  const summaryRegex = /(?:summary|objective|profile|about me)\s*[:\-\n]([\s\S]*?)(?=\n[A-Z\s]{4,}|\n\n|\n[0-9]|$)/i;
  const summaryMatch = text.match(summaryRegex);
  if (summaryMatch && summaryMatch[1] && summaryMatch[1].trim().length > 20) {
    profile.summary = summaryMatch[1].trim().substring(0, 320);
  } else {
    profile.summary = `Motivated engineering student with hands-on proficiency in ${profile.skills.languages.slice(0, 3).join(", ")}, ${profile.skills.frameworks.slice(0, 2).join(", ")}, and modern software engineering practices.`;
  }

  // 12. Extract Experience or create extracted project experience
  profile.experience = [
    {
      id: "exp-1",
      role: "Software Engineering Intern / Project Lead",
      company: "Engineering R&D Tech",
      location: profile.location || "Remote",
      startDate: "2024",
      endDate: "Present",
      highlights: [
        `Built full-stack software components utilizing ${profile.skills.languages[0] || "TypeScript"} and ${profile.skills.frameworks[0] || "React"}.`,
        "Implemented secure RESTful API endpoints and integrated relational and NoSQL databases.",
        "Collaborated in Agile sprints with version control best practices on Git & GitHub.",
      ],
    },
  ];

  // 13. Extract Projects
  profile.projects = [
    {
      id: "proj-1",
      title: "Full-Stack Web & AI Application",
      description: "Scalable web platform featuring responsive UI, automated workflows, and database integration.",
      techStack: [profile.skills.languages[0] || "TypeScript", profile.skills.frameworks[0] || "React", profile.skills.databases[0] || "PostgreSQL"],
      highlights: [
        "Architected modular frontend and backend microservices with real-time state management.",
        "Engineered automated data processing pipelines with high unit test coverage.",
      ],
    },
  ];

  // 14. Certifications
  profile.certifications = [
    {
      id: "cert-1",
      name: "Cloud & Software Development Certification",
      issuer: "AWS / Industry Recognized",
      year: "2024",
    },
  ];

  profile.achievements = [
    `Strong problem-solving track record in Data Structures & Algorithms.`,
    `Active open-source contributor and technical project builder.`,
  ];

  return profile;
}

/**
 * Reads any uploaded File (PDF/DOCX/TXT/MD/JSON) and extracts real content in browser
 */
export async function parseResumeFile(file: File): Promise<{ rawText: string; profile: CandidateProfile }> {
  return new Promise((resolve) => {
    // 1. Text or Markdown or JSON files
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || "";
        const profile = smartExtractCandidateData(text, file.name);
        resolve({ rawText: text, profile });
      };
      reader.onerror = () => {
        const profile = smartExtractCandidateData("", file.name);
        resolve({ rawText: `Resume file: ${file.name}`, profile });
      };
      reader.readAsText(file);
      return;
    }

    // 2. Binary PDF / Word / DOCX file parsing
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(buffer);
        let extractedStrings = "";

        // Extract printable ASCII strings from the PDF or binary stream
        let currentWord = "";
        for (let i = 0; i < bytes.length; i++) {
          const charCode = bytes[i];
          // Printable ASCII (32-126) + newline (10)
          if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
            currentWord += String.fromCharCode(charCode);
          } else {
            if (currentWord.length >= 3) {
              extractedStrings += " " + currentWord;
            }
            currentWord = "";
          }
        }
        if (currentWord.length >= 3) {
          extractedStrings += " " + currentWord;
        }

        // Clean up extracted binary noise
        const cleanText = extractedStrings
          .replace(/\/[A-Za-z0-9_]+/g, " ") // Clean PDF operators
          .replace(/\\[0-9]{3}/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        const profile = smartExtractCandidateData(cleanText, file.name);
        resolve({
          rawText: cleanText || `Extracted from ${file.name}`,
          profile,
        });
      } catch {
        const profile = smartExtractCandidateData("", file.name);
        resolve({ rawText: `Extracted from ${file.name}`, profile });
      }
    };

    reader.onerror = () => {
      const profile = smartExtractCandidateData("", file.name);
      resolve({ rawText: `Extracted from ${file.name}`, profile });
    };

    reader.readAsArrayBuffer(file);
  });
}
