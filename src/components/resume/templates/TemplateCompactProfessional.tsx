import React from "react";
import { ResumeData } from "@/types/resume";

export const TemplateCompactProfessional: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, education, experience, internships, projects, skills, certifications, achievements, languages } = data;

  const contactList = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio,
  ].filter(Boolean);

  return (
    <div className="w-full bg-white text-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 min-h-[750px] text-[11px] font-sans leading-tight space-y-3">
      {/* Compact Header */}
      {(personalInfo.fullName || contactList.length > 0) && (
        <header className="border-b border-slate-300 pb-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          {personalInfo.fullName && (
            <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">
              {personalInfo.fullName}
            </h1>
          )}
          {contactList.length > 0 && (
            <div className="text-[10px] text-slate-600 font-medium">
              {contactList.join(" | ")}
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {summary && (
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-1 pb-0.5">
            SUMMARY
          </h2>
          <p className="text-slate-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            EXPERIENCE
          </h2>
          {experience.map((item) => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{item.position} <span className="font-normal text-slate-600">({item.company})</span></span>
                <span className="text-slate-500 font-normal text-[10px]">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside text-slate-700 pl-1 space-y-0.5 text-[10px]">
                  {item.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education & Projects in 2 Columns */}
      <div className="grid gap-3 sm:grid-cols-2">
        {education.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              EDUCATION
            </h2>
            {education.map((item) => (
              <div key={item.id}>
                <div className="font-bold text-slate-900">{item.institution}</div>
                <div className="text-slate-700 text-[10px]">{item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}</div>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              SKILLS
            </h2>
            {skills.map((item) => (
              <div key={item.id} className="text-[10px]">
                {item.categoryName && <span className="font-bold">{item.categoryName}: </span>}
                <span className="text-slate-700">{item.skills.filter(Boolean).join(", ")}</span>
              </div>
            ))}
          </section>
        )}
      </div>

      {projects.length > 0 && (
        <section className="space-y-1.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            PROJECTS
          </h2>
          {projects.map((item) => (
            <div key={item.id}>
              <span className="font-bold text-slate-900">{item.title}</span> — <span className="text-slate-700">{item.description}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
