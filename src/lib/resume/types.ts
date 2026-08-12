export interface BaseResume {
  fileName: string;
  fileSize: string;
  uploadDate: string;
  rawText: string;
  status: "idle" | "parsing" | "parsed" | "error";
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary: string;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
    softSkills: string[];
  };
  experience: {
    id: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    link?: string;
    highlights: string[];
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationYear: string;
    score: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    year: string;
  }[];
  achievements: string[];
}

export interface GitHubData {
  connected: boolean;
  username: string;
  avatarUrl?: string;
  publicReposCount: number;
  totalStars: number;
  topLanguages: { name: string; percentage: number }[];
  featuredRepos: {
    name: string;
    description: string;
    stars: number;
    language: string;
    url: string;
    updatedAt: string;
  }[];
  recentActivitySummary: string;
}

export interface LeetCodeData {
  connected: boolean;
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  contestRating?: number;
  topTopics: string[];
}

export interface LinkedInData {
  connected: boolean;
  profileUrl: string;
  headline: string;
  summary: string;
  endorsedSkills: string[];
  certifications: string[];
}

export interface ConnectedProfiles {
  github: GitHubData;
  leetcode: LeetCodeData;
  linkedin: LinkedInData;
}

export interface JobOpportunity {
  id: string;
  company: string;
  role: string;
  location: string;
  eligibility: string;
  jobDescription: string;
  skills: string[];
  applyLink: string;
  deadline: string;
  matchScore?: number;
}

export interface JobAnalysisResult {
  overallMatchScore: number;
  skillsMatchScore: number;
  projectMatchScore: number;
  experienceMatchScore: number;
  keywordMatchScore: number;
  matchedSkills: string[];
  partialSkills: string[];
  missingSkills: string[];
  keyRequirements: string[];
  coreResponsibilities: string[];
  tailoringRecommendations: string[];
}

export interface DiffItem {
  section: string;
  original: string;
  tailored: string;
  reason: string;
}

export interface TailoredResume extends CandidateProfile {
  jobId: string;
  jobTitle: string;
  companyName: string;
  tailoredSummary: string;
  diffs: DiffItem[];
  generatedAt: string;
}

export type ResumeTemplateId = "modern-minimal" | "professional-classic" | "tech-focused" | "executive-clean";
