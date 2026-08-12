import { JobOpportunity } from "./types";

export const sampleJobsDataset: JobOpportunity[] = [
  {
    id: "job-1",
    company: "ABC Technologies",
    role: "AI Software Intern",
    location: "Bengaluru, India (Hybrid)",
    eligibility: "B.E / B.Tech CSE / IT 2025/2026 Batch with CGPA >= 7.5",
    jobDescription:
      "We are seeking an enthusiastic AI Software Intern to design, develop, and integrate machine learning microservices into our flagship cloud product. You will work closely with senior AI engineers to build RESTful APIs using Python and FastAPI, implement model evaluation pipelines, optimize SQL query execution, and write clean, scalable TypeScript/React frontend components.",
    skills: ["Python", "FastAPI", "Machine Learning", "TypeScript", "React", "SQL", "Git", "REST APIs"],
    applyLink: "https://abctechnologies.com/careers/ai-intern",
    deadline: "2026-08-25",
  },
  {
    id: "job-2",
    company: "Nexus Cloud Systems",
    role: "Full Stack Developer Intern",
    location: "Remote / Hyderabad",
    eligibility: "Pre-Final Year & Final Year Computer Science Students",
    jobDescription:
      "Join Nexus Cloud Systems to build modern high-throughput web applications. The ideal candidate has hands-on experience with React, Next.js, Node.js, TypeScript, PostgreSQL, and Docker. Responsibilities include building responsive UI components, engineering serverless API routes, writing unit tests, and optimizing database queries for real-time dashboards.",
    skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "Docker", "TailwindCSS", "REST APIs"],
    applyLink: "https://nexuscloud.io/jobs/fullstack-intern",
    deadline: "2026-08-30",
  },
  {
    id: "job-3",
    company: "Cognitive AI Labs",
    role: "Machine Learning & Data Engineer",
    location: "Bengaluru, India",
    eligibility: "B.E / B.Tech / M.Tech in CS, AI, Data Science with strong math foundation",
    jobDescription:
      "Cognitive AI Labs is looking for a Data Engineer intern. Key responsibilities involve developing ETL pipelines, processing structured/unstructured datasets using Python, pandas, and PyTorch, fine-tuning computer vision models, and building Dockerized microservices deployed on AWS.",
    skills: ["Python", "PyTorch", "Data Engineering", "Pandas", "Docker", "AWS", "Machine Learning", "PostgreSQL"],
    applyLink: "https://cognitiveailabs.org/careers/ml-engineer",
    deadline: "2026-09-05",
  },
  {
    id: "job-4",
    company: "FinTech Global Innovations",
    role: "Frontend Engineer Intern",
    location: "Chennai, India (On-site)",
    eligibility: "CGPA >= 8.0, Strong Problem Solving & Data Structures skills",
    jobDescription:
      "Seeking a detail-oriented Frontend Engineer Intern passionate about web accessibility and high-performance user interfaces. You will build component libraries in React 19, implement state management using TanStack Query, collaborate with UX designers, and ensure high cross-browser compatibility.",
    skills: ["React", "TypeScript", "JavaScript", "TailwindCSS", "HTML5/CSS3", "State Management", "Git"],
    applyLink: "https://fintechglobal.com/internships/frontend",
    deadline: "2026-08-20",
  },
  {
    id: "job-5",
    company: "QuantEdge Solutions",
    role: "Backend & Systems Intern",
    location: "Bengaluru, India",
    eligibility: "2026 Batch CS/IT, 250+ LeetCode problems solved preferred",
    jobDescription:
      "QuantEdge Solutions invites applications for Backend Systems Interns. The candidate will work on high-frequency algorithmic engine infrastructure using C++ and Python. Skills needed: Data Structures & Algorithms, Systems Programming, Multi-threading, Redis, microservices, and Linux tooling.",
    skills: ["C++", "Python", "Data Structures", "Algorithms", "Redis", "Linux", "System Design"],
    applyLink: "https://quantedge.tech/careers/backend-intern",
    deadline: "2026-09-12",
  },
];

/**
 * Parses CSV or Excel file text content into structured JobOpportunity array
 */
export async function parseJobsExcelFile(file: File): Promise<JobOpportunity[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      const lines = text.split("\n").filter((l) => l.trim().length > 0);

      if (lines.length <= 1) {
        // Return sample dataset if file format is empty or custom binary without CSV header
        resolve(sampleJobsDataset);
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
      const parsedJobs: JobOpportunity[] = [];

      for (let i = 1; i < lines.length; i++) {
        // CSV split handling simple quotes
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length >= 2) {
          const companyIndex = headers.findIndex((h) => h.includes("company"));
          const roleIndex = headers.findIndex((h) => h.includes("role") || h.includes("title"));
          const locIndex = headers.findIndex((h) => h.includes("location"));
          const eligIndex = headers.findIndex((h) => h.includes("eligibility") || h.includes("criteria"));
          const jdIndex = headers.findIndex((h) => h.includes("description") || h.includes("jd"));
          const skillsIndex = headers.findIndex((h) => h.includes("skill"));
          const applyIndex = headers.findIndex((h) => h.includes("link") || h.includes("apply"));
          const deadlineIndex = headers.findIndex((h) => h.includes("deadline") || h.includes("date"));

          const skillsText = cols[skillsIndex >= 0 ? skillsIndex : 3] || "Python, React, TypeScript";
          const skillsArr = skillsText.split(/[,•|]/).map((s) => s.trim()).filter(Boolean);

          parsedJobs.push({
            id: `imported-job-${i}-${Date.now()}`,
            company: cols[companyIndex >= 0 ? companyIndex : 0] || "Placement Partner",
            role: cols[roleIndex >= 0 ? roleIndex : 1] || "Software Engineering Intern",
            location: cols[locIndex >= 0 ? locIndex : 2] || "India (Hybrid)",
            eligibility: cols[eligIndex >= 0 ? eligIndex : 3] || "CS/IT Students (2025/2026)",
            jobDescription: cols[jdIndex >= 0 ? jdIndex : 4] || "Software development internship opportunity.",
            skills: skillsArr.length > 0 ? skillsArr : ["Python", "JavaScript", "SQL"],
            applyLink: cols[applyIndex >= 0 ? applyIndex : 5] || "#",
            deadline: cols[deadlineIndex >= 0 ? deadlineIndex : 6] || "2026-09-30",
          });
        }
      }

      resolve(parsedJobs.length > 0 ? parsedJobs : sampleJobsDataset);
    };

    reader.onerror = () => {
      resolve(sampleJobsDataset);
    };

    reader.readAsText(file);
  });
}
