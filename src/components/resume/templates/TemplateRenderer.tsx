import React from "react";
import { ResumeData } from "@/types/resume";
import { getTemplateById } from "./templateRegistry";

interface Props {
  templateId: string;
  data: ResumeData;
}

export const TemplateRenderer: React.FC<Props> = ({ templateId, data }) => {
  const template = getTemplateById(templateId);
  const Component = template.component;

  return <Component data={data} />;
};
