import React from "react";
import { ResumeData } from "@/types/resume";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { SummarySection } from "./sections/SummarySection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { InternshipSection } from "./sections/InternshipSection";
import { ProjectSection } from "./sections/ProjectSection";
import { SkillsSection } from "./sections/SkillsSection";
import { CertificationSection } from "./sections/CertificationSection";
import { AchievementSection } from "./sections/AchievementSection";
import { LanguageSection } from "./sections/LanguageSection";
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Award,
  FolderGit2,
  Wrench,
  ShieldCheck,
  Trophy,
  Languages,
} from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="rounded-2xl p-6 glass space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Resume Information Editor</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Fill in your details below. The live preview on the right will update in real-time.
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="personal" className="w-full space-y-2">
        {/* Personal Information */}
        <AccordionItem value="personal" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Personal Information
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <PersonalInfoSection
              data={data.personalInfo}
              onChange={(personalInfo) => onChange({ ...data, personalInfo })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Professional Summary */}
        <AccordionItem value="summary" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Professional Summary
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <SummarySection
              summary={data.summary}
              onChange={(summary) => onChange({ ...data, summary })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm flex justify-between w-full pr-2">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" /> Education ({data.education.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <EducationSection
              items={data.education}
              onChange={(education) => onChange({ ...data, education })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm flex justify-between w-full pr-2">
            <span className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Work Experience ({data.experience.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <ExperienceSection
              items={data.experience}
              onChange={(experience) => onChange({ ...data, experience })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Internships */}
        <AccordionItem value="internships" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm flex justify-between w-full pr-2">
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Internships ({data.internships.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <InternshipSection
              items={data.internships}
              onChange={(internships) => onChange({ ...data, internships })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm flex justify-between w-full pr-2">
            <span className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-primary" /> Projects ({data.projects.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <ProjectSection
              items={data.projects}
              onChange={(projects) => onChange({ ...data, projects })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm flex justify-between w-full pr-2">
            <span className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" /> Skills ({data.skills.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <SkillsSection
              items={data.skills}
              onChange={(skills) => onChange({ ...data, skills })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm flex justify-between w-full pr-2">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Certifications ({data.certifications.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <CertificationSection
              items={data.certifications}
              onChange={(certifications) => onChange({ ...data, certifications })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Achievements */}
        <AccordionItem value="achievements" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm flex justify-between w-full pr-2">
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" /> Achievements ({data.achievements.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <AchievementSection
              items={data.achievements}
              onChange={(achievements) => onChange({ ...data, achievements })}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages" className="border rounded-xl px-4 bg-card/60">
          <AccordionTrigger className="hover:no-underline font-semibold text-sm flex justify-between w-full pr-2">
            <span className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-primary" /> Languages ({data.languages.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <LanguageSection
              items={data.languages}
              onChange={(languages) => onChange({ ...data, languages })}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
