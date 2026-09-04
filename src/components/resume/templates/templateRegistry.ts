import React from "react";
import { ResumeData } from "@/types/resume";

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: "Classic" | "Modern" | "Technical" | "Creative" | "Executive";
  badge?: string;
  component: React.FC<{ data: ResumeData }>;
}

import { TemplateModernProfessional } from "./TemplateModernProfessional";
import { TemplateATSClassic } from "./TemplateATSClassic";
import { TemplateMinimalist } from "./TemplateMinimalist";
import { TemplateStudentFresher } from "./TemplateStudentFresher";
import { TemplateTechnicalDeveloper } from "./TemplateTechnicalDeveloper";
import { TemplateCreativeProfessional } from "./TemplateCreativeProfessional";
import { TemplateCorporateExecutive } from "./TemplateCorporateExecutive";
import { TemplateTwoColumnModern } from "./TemplateTwoColumnModern";
import { TemplateAcademic } from "./TemplateAcademic";
import { TemplateCompactProfessional } from "./TemplateCompactProfessional";

export const RESUME_TEMPLATES: TemplateMetadata[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Balanced single-column layout with clean accent headers and formatted badges.",
    category: "Modern",
    badge: "Popular",
    component: TemplateModernProfessional,
  },
  {
    id: "ats_classic",
    name: "ATS Classic",
    description: "100% ATS parser friendly, unstyled structural hierarchy with serif fonts.",
    category: "Classic",
    badge: "ATS Safe",
    component: TemplateATSClassic,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Subtle typography with maximum white space and borderless section titles.",
    category: "Modern",
    component: TemplateMinimalist,
  },
  {
    id: "student",
    name: "Student / Fresher",
    description: "Education and Projects prioritized at the top for early-career profiles.",
    category: "Modern",
    component: TemplateStudentFresher,
  },
  {
    id: "tech_dev",
    name: "Technical Developer",
    description: "Code-accented layout with technology tags and highlighted GitHub repository links.",
    category: "Technical",
    badge: "Best for Devs",
    component: TemplateTechnicalDeveloper,
  },
  {
    id: "creative",
    name: "Creative Professional",
    description: "Modern two-column layout separating sidebar bio/skills from main experience timeline.",
    category: "Creative",
    component: TemplateCreativeProfessional,
  },
  {
    id: "executive",
    name: "Corporate Executive",
    description: "Bold header band with strategic summary hero section for senior leadership roles.",
    category: "Executive",
    component: TemplateCorporateExecutive,
  },
  {
    id: "two_column",
    name: "Two-Column Modern",
    description: "Asymmetric split layout with left accent column and right work history column.",
    category: "Creative",
    component: TemplateTwoColumnModern,
  },
  {
    id: "academic",
    name: "Academic",
    description: "Formal scholarly structure emphasizing degrees, research projects, and achievements.",
    category: "Classic",
    component: TemplateAcademic,
  },
  {
    id: "compact",
    name: "Compact Professional",
    description: "High-density single-page design with condensed padding for extensive work history.",
    category: "Executive",
    component: TemplateCompactProfessional,
  },
];

export function getTemplateById(id: string): TemplateMetadata {
  if (!id) return RESUME_TEMPLATES[0];
  const exact = RESUME_TEMPLATES.find((t) => t.id === id);
  if (exact) return exact;

  const normalized = id.toLowerCase().replace(/[-_\s]/g, "");
  return (
    RESUME_TEMPLATES.find((t) => {
      const tNorm = t.id.toLowerCase().replace(/[-_\s]/g, "");
      return tNorm === normalized || normalized.includes(tNorm) || tNorm.includes(normalized);
    }) || RESUME_TEMPLATES[0]
  );
}
