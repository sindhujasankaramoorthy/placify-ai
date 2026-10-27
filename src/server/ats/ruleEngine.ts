export interface ATSScanResult {
  overallScore: number;
  matchScore: number;
  formattingScore: number;
  structureScore: number;
  techStack: {
    matched: string[];
    missing: string[];
  };
  keywords: {
    matched: string[];
    missing: string[];
  };
  sectionsFound: string[];
  sectionsMissing: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  verdict: "Strong match" | "Moderate match" | "Weak match";
}

// Synonyms mapping: key is canonical skill, values are alternative representations / synonyms
export const TECH_SYNONYMS: Record<string, string[]> = {
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
};

// General industry buzzwords/keywords often sought in ATS scans
export const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "Agile / Scrum": ["agile", "scrum", "sprint", "kanban"],
  "Unit Testing": ["unit test", "unit testing", "jest", "pytest", "junit", "testing"],
  "System Design": ["system design", "microservices", "distributed systems", "high availability", "scalability"],
  "Data Structures": ["data structures", "algorithms", "dsa", "problem solving", "algorithmic"],
  "Object-Oriented Programming": ["oop", "object-oriented", "object oriented", "design patterns"],
  "Cloud Architecture": ["cloud architecture", "serverless", "cloud computing"],
  "API Design": ["api design", "api integration", "endpoints", "swagger", "openapi"],
  "Performance Optimization": ["optimization", "performance tuning", "caching", "latency reduction", "scalability"],
  "Code Review": ["code review", "code quality", "clean code", "maintainability"]
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function textContainsTerm(text: string, term: string): boolean {
  const cleanTerm = escapeRegex(term);
  // Match word boundary if possible, handle symbols like ++ or .
  const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${cleanTerm}(?:$|[^a-zA-Z0-9_#+])`, "i");
  return pattern.test(text);
}

function checkSynonymMatch(text: string, synonyms: string[]): boolean {
  return synonyms.some((syn) => textContainsTerm(text, syn));
}

export function performRuleBasedATSAnalysis(
  resumeText: string,
  jobDescription: string
): ATSScanResult {
  const normResume = resumeText.toLowerCase();
  const normJD = jobDescription.toLowerCase();

  // 1. Tech Stack Extraction & Matching
  const jdTechMatched: string[] = [];
  const jdTechMissing: string[] = [];

  for (const [canonical, syns] of Object.entries(TECH_SYNONYMS)) {
    // Check if JD mentions this technology
    const inJD = checkSynonymMatch(normJD, syns);
    if (inJD) {
      // Check if candidate resume has it
      const inResume = checkSynonymMatch(normResume, syns);
      if (inResume) {
        jdTechMatched.push(canonical);
      } else {
        jdTechMissing.push(canonical);
      }
    }
  }

  // Fallback if JD didn't explicitly match dictionary items: check standard keywords
  const jdKeywordsMatched: string[] = [];
  const jdKeywordsMissing: string[] = [];

  for (const [canonical, syns] of Object.entries(INDUSTRY_KEYWORDS)) {
    const inJD = checkSynonymMatch(normJD, syns);
    if (inJD) {
      const inResume = checkSynonymMatch(normResume, syns);
      if (inResume) {
        jdKeywordsMatched.push(canonical);
      } else {
        jdKeywordsMissing.push(canonical);
      }
    }
  }

  // Calculate Match Score
  const totalSkillsEvaluated = jdTechMatched.length + jdTechMissing.length;
  const totalKeywordsEvaluated = jdKeywordsMatched.length + jdKeywordsMissing.length;
  
  let matchScore = 75;
  if (totalSkillsEvaluated > 0) {
    const skillRatio = jdTechMatched.length / totalSkillsEvaluated;
    const kwRatio = totalKeywordsEvaluated > 0 ? jdKeywordsMatched.length / totalKeywordsEvaluated : skillRatio;
    matchScore = Math.round((skillRatio * 0.75 + kwRatio * 0.25) * 100);
  } else if (jdTechMatched.length > 0) {
    matchScore = 85;
  }

  // 2. Structural & Section Analysis
  const sectionsExpected = [
    { name: "Contact Information", test: /\b(email|phone|contact|linkedin|github|portfolio)\b/i },
    { name: "Professional Summary", test: /\b(summary|objective|profile|about me|professional summary)\b/i },
    { name: "Education", test: /\b(education|university|college|degree|b\.?e\.?|b\.?tech|bachelor|master)\b/i },
    { name: "Technical Skills", test: /\b(skills|technical skills|technologies|proficiencies|tools|languages)\b/i },
    { name: "Experience / Internships", test: /\b(experience|work experience|employment|internship|internships|professional experience)\b/i },
    { name: "Projects", test: /\b(projects|personal projects|academic projects|key projects)\b/i }
  ];

  const sectionsFound: string[] = [];
  const sectionsMissing: string[] = [];

  for (const sec of sectionsExpected) {
    if (sec.test.test(normResume)) {
      sectionsFound.push(sec.name);
    } else {
      sectionsMissing.push(sec.name);
    }
  }

  // Structure score based on sections detected
  const structureScore = Math.round((sectionsFound.length / sectionsExpected.length) * 100);

  // 3. Formatting & Quality Checks
  let formattingScore = 100;
  const formattingDeductions: string[] = [];

  // Check email
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  if (!hasEmail) {
    formattingScore -= 15;
    formattingDeductions.push("Missing or non-standard email address format.");
  }

  // Check phone
  const hasPhone = /(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(resumeText);
  if (!hasPhone) {
    formattingScore -= 10;
    formattingDeductions.push("Missing standard phone number.");
  }

  // Check bullet points
  const bulletCount = (resumeText.match(/[•\-*]|\d+\.\s/g) || []).length;
  if (bulletCount < 4) {
    formattingScore -= 15;
    formattingDeductions.push("Few or missing bullet points; ATS systems parse bulleted achievements better than paragraph blocks.");
  }

  // Check word length (too short < 120 words, too long > 1500 words)
  const words = resumeText.trim().split(/\s+/).filter(Boolean);
  if (words.length < 120) {
    formattingScore -= 20;
    formattingDeductions.push("Resume content is sparse (under 120 words). Include detailed project and experience descriptions.");
  } else if (words.length > 1500) {
    formattingScore -= 10;
    formattingDeductions.push("Resume length is excessive (over 1500 words). Aim for a concise 1-2 page layout.");
  }

  // Check for quantifiable metrics (percentages, numbers, multipliers)
  const hasMetrics = /\b\d+%\b|\b\d+x\b|\b\$\d+|\b\d+\+\s?(users|clients|requests|ms|seconds|hours)/i.test(resumeText);
  if (!hasMetrics) {
    formattingScore -= 10;
    formattingDeductions.push("Lack of quantifiable metric results (e.g. 'reduced latency by 40%', 'served 10k users').");
  }

  formattingScore = Math.max(20, Math.min(100, formattingScore));

  // 4. Overall Weighted Score
  // Match score: 60%, Formatting: 20%, Structure: 20%
  const overallScore = Math.max(10, Math.min(100, Math.round(
    matchScore * 0.60 + formattingScore * 0.20 + structureScore * 0.20
  )));

  // Verdict rating with increased threshold
  let verdict: "Strong match" | "Moderate match" | "Weak match" = "Moderate match";
  if (overallScore >= 80) verdict = "Strong match";
  else if (overallScore < 60) verdict = "Weak match";

  // 5. Strengths
  const strengths: string[] = [];
  if (jdTechMatched.length > 0) {
    strengths.push(`Core competencies aligned: matches ${jdTechMatched.length} key required tech stack items (${jdTechMatched.slice(0, 4).join(", ")}).`);
  }
  if (sectionsFound.includes("Projects") && sectionsFound.includes("Technical Skills")) {
    strengths.push("Well-defined technical skills and practical projects sections detected.");
  }
  if (hasMetrics) {
    strengths.push("Incorporates quantifiable performance metrics and outcome indicators.");
  }
  if (hasEmail && hasPhone) {
    strengths.push("Clear candidate contact information formatted properly for ATS parsing.");
  }
  if (bulletCount >= 6) {
    strengths.push("Effective bullet-pointed accomplishments highlighting discrete deliverables.");
  }

  // 6. Weaknesses
  const weaknesses: string[] = [];
  if (jdTechMissing.length > 0) {
    weaknesses.push(`Missing prominent target skills specified in the job description: ${jdTechMissing.slice(0, 4).join(", ")}.`);
  }
  if (sectionsMissing.length > 0) {
    weaknesses.push(`Missing standard ATS resume sections: ${sectionsMissing.join(", ")}.`);
  }
  if (formattingDeductions.length > 0) {
    weaknesses.push(formattingDeductions[0]);
  }
  if (!hasMetrics) {
    weaknesses.push("Bullet points are predominantly descriptive rather than results-oriented with quantifiable impact.");
  }

  // 7. Actionable Suggestions
  const suggestions: string[] = [];
  if (jdTechMissing.length > 0) {
    suggestions.push(
      `Incorporate missing target technologies [${jdTechMissing.slice(0, 3).join(", ")}] into your skills taxonomy or describe relevant coursework/projects using them.`
    );
  }
  if (sectionsMissing.includes("Professional Summary")) {
    suggestions.push("Add a focused 2-3 sentence Professional Summary at the top tailored to this target role.");
  }
  if (!hasMetrics) {
    suggestions.push("Apply the Google XYZ framework: 'Accomplished [X] measured by [Y] by doing [Z]' to articulate project achievements.");
  }
  if (sectionsMissing.includes("Projects")) {
    suggestions.push("Create a dedicated 'Key Projects' section detailing technical architecture, libraries, and live/GitHub links.");
  }
  suggestions.push("Ensure job titles and section headings match standard industry conventions so ATS parsers index them cleanly.");

  return {
    overallScore,
    matchScore,
    formattingScore,
    structureScore,
    techStack: {
      matched: jdTechMatched,
      missing: jdTechMissing,
    },
    keywords: {
      matched: jdKeywordsMatched,
      missing: jdKeywordsMissing,
    },
    sectionsFound,
    sectionsMissing,
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    suggestions: suggestions.slice(0, 4),
    verdict,
  };
}
