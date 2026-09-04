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

/**
 * Converts Placify CandidateProfile (from main branch) into ResumeData (for the builder)
 */
export function candidateProfileToResumeData(profile: any, connected?: any): ResumeData {
  if (!profile) return createEmptyResumeData();

  const skillsList: SkillCategory[] = [];
  if (profile.skills) {
    if (profile.skills.languages?.length) {
      skillsList.push({ id: "cat-lang", categoryName: "Programming Languages", skills: profile.skills.languages });
    }
    if (profile.skills.frameworks?.length) {
      skillsList.push({ id: "cat-frame", categoryName: "Frameworks & Libraries", skills: profile.skills.frameworks });
    }
    if (profile.skills.databases?.length) {
      skillsList.push({ id: "cat-db", categoryName: "Databases", skills: profile.skills.databases });
    }
    if (profile.skills.tools?.length) {
      skillsList.push({ id: "cat-tools", categoryName: "Developer Tools & Cloud", skills: profile.skills.tools });
    }
    if (profile.skills.softSkills?.length) {
      skillsList.push({ id: "cat-soft", categoryName: "Soft Skills", skills: profile.skills.softSkills });
    }
  }

  // If connected GitHub has featured repos and profile doesn't have enough projects, integrate them
  const projects: Project[] = (profile.projects || []).map((p: any, idx: number) => ({
    id: p.id || `proj-${idx + 1}`,
    title: p.title || "Project",
    description: p.description || "",
    technologies: Array.isArray(p.techStack) ? p.techStack : [],
    githubLink: p.link?.includes("github.com") ? p.link : "",
    liveLink: !p.link?.includes("github.com") ? p.link || "" : "",
    bullets: Array.isArray(p.highlights) ? p.highlights : [],
  }));

  if (connected?.github?.featuredRepos?.length && projects.length < 3) {
    for (const repo of connected.github.featuredRepos.slice(0, 3 - projects.length)) {
      if (!projects.some((p) => p.title.toLowerCase() === repo.name.toLowerCase())) {
        projects.push({
          id: `gh-${repo.name}`,
          title: repo.name,
          description: repo.description || `Developed full-stack application using ${repo.language}.`,
          technologies: repo.language ? [repo.language] : [],
          githubLink: repo.url,
          liveLink: "",
          bullets: [
            `Implemented core functionality with high code quality and test coverage.`,
            `Starred by ${repo.stars} community developers on GitHub.`
          ],
        });
      }
    }
  }

  return {
    personalInfo: {
      fullName: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      linkedin: profile.linkedinUrl || connected?.linkedin?.profileUrl || "",
      github: profile.githubUrl || (connected?.github?.username ? `https://github.com/${connected.github.username}` : ""),
      portfolio: profile.portfolioUrl || "",
    },
    summary: profile.summary || "",
    education: (profile.education || []).map((e: any, idx: number) => ({
      id: e.id || `edu-${idx + 1}`,
      institution: e.institution || "",
      degree: e.degree || "",
      fieldOfStudy: "",
      startDate: "",
      endDate: e.graduationYear || "",
      gpa: e.score || "",
      location: e.location || "",
    })),
    experience: (profile.experience || []).map((exp: any, idx: number) => ({
      id: exp.id || `exp-${idx + 1}`,
      company: exp.company || "",
      position: exp.role || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      isCurrent: exp.endDate?.toLowerCase().includes("present") || exp.endDate?.toLowerCase().includes("current") || false,
      bullets: Array.isArray(exp.highlights) ? exp.highlights : [],
    })),
    internships: [],
    projects,
    skills: skillsList,
    certifications: (profile.certifications || []).map((c: any, idx: number) => ({
      id: c.id || `cert-${idx + 1}`,
      name: c.name || "",
      issuer: c.issuer || "",
      issueDate: c.year || "",
      url: "",
    })),
    achievements: (profile.achievements || []).map((ach: any, idx: number) => ({
      id: `ach-${idx + 1}`,
      title: typeof ach === "string" ? ach : ach.title || "Achievement",
      description: typeof ach === "string" ? "" : ach.description || "",
      date: "",
    })),
    languages: [],
  };
}

/**
 * Converts ResumeData (from the builder) into Placify CandidateProfile
 */
export function resumeDataToCandidateProfile(data: ResumeData): any {
  if (!data) return null;

  const languages: string[] = [];
  const frameworks: string[] = [];
  const tools: string[] = [];
  const databases: string[] = [];
  const softSkills: string[] = [];

  for (const cat of data.skills || []) {
    const name = (cat.categoryName || "").toLowerCase();
    const skills = cat.skills || [];
    if (name.includes("lang") || name.includes("code")) {
      languages.push(...skills);
    } else if (name.includes("frame") || name.includes("lib")) {
      frameworks.push(...skills);
    } else if (name.includes("tool") || name.includes("cloud") || name.includes("devops")) {
      tools.push(...skills);
    } else if (name.includes("data") || name.includes("db") || name.includes("sql")) {
      databases.push(...skills);
    } else if (name.includes("soft") || name.includes("lead")) {
      softSkills.push(...skills);
    } else {
      tools.push(...skills);
    }
  }

  // Combine experience and internships
  const experienceList = [
    ...(data.experience || []).map((exp, idx) => ({
      id: exp.id || `exp-${idx + 1}`,
      role: exp.position || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.isCurrent ? "Present" : exp.endDate || "",
      highlights: exp.bullets || [],
    })),
    ...(data.internships || []).map((int, idx) => ({
      id: int.id || `int-${idx + 1}`,
      role: int.role || "Intern",
      company: int.company || "",
      location: int.location || "",
      startDate: int.startDate || "",
      endDate: int.endDate || "",
      highlights: int.bullets || [],
    })),
  ];

  const projectsList = (data.projects || []).map((p, idx) => ({
    id: p.id || `proj-${idx + 1}`,
    title: p.title || "",
    description: p.description || "",
    techStack: p.technologies || [],
    link: p.githubLink || p.liveLink || "",
    highlights: p.bullets || [],
  }));

  const educationList = (data.education || []).map((edu, idx) => ({
    id: edu.id || `edu-${idx + 1}`,
    degree: edu.degree || "",
    institution: edu.institution || "",
    location: edu.location || "",
    graduationYear: edu.endDate || "",
    score: edu.gpa || "",
  }));

  const certList = (data.certifications || []).map((c, idx) => ({
    id: c.id || `cert-${idx + 1}`,
    name: c.name || "",
    issuer: c.issuer || "",
    year: c.issueDate || "",
  }));

  const achList = (data.achievements || []).map((a, idx) => ({
    id: a.id || `ach-${idx + 1}`,
    title: a.title || "",
    description: a.description || "",
  }));

  return {
    name: data.personalInfo?.fullName || "",
    email: data.personalInfo?.email || "",
    phone: data.personalInfo?.phone || "",
    location: data.personalInfo?.location || "",
    linkedinUrl: data.personalInfo?.linkedin || "",
    githubUrl: data.personalInfo?.github || "",
    portfolioUrl: data.personalInfo?.portfolio || "",
    summary: data.summary || "",
    skills: {
      languages,
      frameworks,
      tools,
      databases,
      softSkills,
    },
    experience: experienceList,
    projects: projectsList,
    education: educationList,
    certifications: certList,
    achievements: achList,
  };
}

