import React from "react";
import { ResumeData, normalizeResumeData } from "@/types/resume";
import { TemplateRenderer } from "./templates/TemplateRenderer";
import { getTemplateById } from "./templates/templateRegistry";

interface Props {
  data: ResumeData;
  templateId: string;
}

export const ResumePreview: React.FC<Props> = ({ data, templateId }) => {
  const currentTemplate = getTemplateById(templateId);
  const safeData = normalizeResumeData(data);

  const {
    personalInfo,
    summary,
    education,
    experience,
    internships,
    projects,
    skills,
    certifications,
    achievements,
    languages,
  } = safeData;

  const hasContactInfo =
    Boolean(personalInfo?.email) ||
    Boolean(personalInfo?.phone) ||
    Boolean(personalInfo?.location) ||
    Boolean(personalInfo?.linkedin) ||
    Boolean(personalInfo?.github) ||
    Boolean(personalInfo?.portfolio);

  const isEmptyResume =
    !personalInfo?.fullName &&
    !hasContactInfo &&
    !summary &&
    (education?.length || 0) === 0 &&
    (experience?.length || 0) === 0 &&
    (internships?.length || 0) === 0 &&
    (projects?.length || 0) === 0 &&
    (skills?.length || 0) === 0 &&
    (certifications?.length || 0) === 0 &&
    (achievements?.length || 0) === 0 &&
    (languages?.length || 0) === 0;

  return (
    <div className="rounded-2xl p-6 glass space-y-4 h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
        <div>
          <h3 className="text-lg font-bold">Live Resume Preview</h3>
          <p className="text-xs text-muted-foreground">Updates in real-time as you edit</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          {currentTemplate.name}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {isEmptyResume ? (
          <div className="w-full bg-card rounded-xl p-8 shadow-sm border border-border min-h-[700px] flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
              📄
            </div>
            <h4 className="font-semibold text-foreground">Your Resume Preview is Empty</h4>
            <p className="text-xs max-w-sm">
              Start by entering your details in the editor on the left. You can switch templates anytime using the Template button above.
            </p>
          </div>
        ) : (
          <div id="resume-preview-document">
            <TemplateRenderer templateId={templateId} data={safeData} />
          </div>
        )}
      </div>
    </div>
  );
};
