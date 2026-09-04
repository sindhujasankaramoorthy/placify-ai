import React from "react";
import { ResumeData } from "@/types/resume";

export const TemplateCorporateExecutive: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="w-full bg-white text-slate-900 rounded-xl shadow-sm border border-slate-200 min-h-[750px] text-xs font-sans space-y-6">
      {/* Executive Hero Header */}
      <header className="bg-slate-900 text-white p-7 text-center rounded-t-xl space-y-2">
        {personalInfo.fullName && (
          <h1 className="text-2xl font-extrabold uppercase tracking-wider text-white">
            {personalInfo.fullName}
          </h1>
        )}
        {contactList.length > 0 && (
          <div className="text-[11px] text-slate-300 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-light">
            {contactList.join("  •  ")}
          </div>
        )}
      </header>

      <div className="px-8 pb-8 space-y-6">
        {/* Executive Summary */}
        {summary && (
          <section className="bg-slate-50 p-4 rounded border-l-4 border-slate-900 space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Executive Profile</h2>
            <p className="text-slate-700 text-[11px] leading-relaxed italic">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Leadership & Work Experience
            </h2>
            {experience.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{item.position} | <span className="text-slate-700">{item.company}</span></span>
                  <span className="text-slate-500 font-normal text-[11px]">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
                </div>
                {item.location && <div className="text-[10px] text-slate-500">{item.location}</div>}
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 text-[11px]">
                    {item.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Education & Professional Credentials
            </h2>
            {education.map((item) => (
              <div key={item.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{item.institution}</span> — {item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}
                </div>
                <span className="text-slate-500 text-[11px]">{item.startDate} – {item.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {/* Skills & Competencies */}
        {skills.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Core Competencies
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {skills.map((item) => (
                <div key={item.id} className="text-[11px]">
                  {item.categoryName && <span className="font-bold text-slate-900">{item.categoryName}: </span>}
                  <span className="text-slate-700">{item.skills.filter(Boolean).join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages */}
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">Board & Certifications</h2>
              {certifications.map((c) => (
                <div key={c.id} className="text-[11px] text-slate-800 font-medium">{c.name} {c.issuer && `(${c.issuer})`}</div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">Global Languages</h2>
              <div className="text-[11px] text-slate-800">
                {languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(", ")}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
