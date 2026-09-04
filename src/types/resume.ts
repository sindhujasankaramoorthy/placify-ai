export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
  location: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  url: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string; // e.g., "Native", "Fluent", "Intermediate", "Basic"
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  experience: WorkExperience[];
  internships: Internship[];
  projects: Project[];
  skills: SkillCategory[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
}

export interface ResumeRecord {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  data: ResumeData;
  atsScore: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Creates a clean, empty resume structure with zero hardcoded or fake data.
 */
export function createEmptyResumeData(): ResumeData {
  return {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    education: [],
    experience: [],
    internships: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    languages: [],
  };
}

/**
 * Normalizes partial or dynamically fetched/parsed resume data into a safe ResumeData structure.
 */
export function normalizeResumeData(data: Partial<ResumeData> | null | undefined): ResumeData {
  const empty = createEmptyResumeData();
  if (!data) return empty;

  return {
    personalInfo: {
      fullName: data.personalInfo?.fullName || "",
      email: data.personalInfo?.email || "",
      phone: data.personalInfo?.phone || "",
      location: data.personalInfo?.location || "",
      linkedin: data.personalInfo?.linkedin || "",
      github: data.personalInfo?.github || "",
      portfolio: data.personalInfo?.portfolio || "",
    },
    summary: data.summary || "",
    education: Array.isArray(data.education) ? data.education : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    internships: Array.isArray(data.internships) ? data.internships : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
  };
}
