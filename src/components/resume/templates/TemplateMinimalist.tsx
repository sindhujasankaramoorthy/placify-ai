import React from "react";
import { ResumeData } from "@/types/resume";

export const TemplateMinimalist: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, education, experience, internships, projects, skills, certifications, achievements, languages } = data;

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio,
  ].filter(Boolean);

  return (
    <div className="w-full bg-white text-zinc-800 rounded-xl p-9 shadow-sm border border-zinc-200 min-h-[750px] text-xs font-sans space-y-6">
      {/* Header */}
      <header className="space-y-2">
        {personalInfo.fullName && (
          <h1 className="text-3xl font-light tracking-tight text-zinc-900">
            {personalInfo.fullName}
          </h1>
        )}
        {contactItems.length > 0 && (
          <p className="text-[11px] text-zinc-500 font-normal">
            {contactItems.join(" • ")}
          </p>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-1.5 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Summary
          </h2>
          <p className="text-zinc-700 leading-relaxed font-light">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="space-y-4 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Experience
          </h2>
          {experience.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-medium text-zinc-900">
                  {item.position} <span className="text-zinc-400 font-light">{item.company && `at ${item.company}`}</span>
                </span>
                <span className="text-[11px] text-zinc-400 font-light">
                  {item.startDate} {item.startDate && (item.endDate || item.isCurrent) && "—"}{" "}
                  {item.isCurrent ? "Present" : item.endDate}
                </span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="space-y-1 text-zinc-600 font-light pl-3 border-l border-zinc-100 text-[11px]">
                  {item.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Internships */}
      {internships.length > 0 && (
        <section className="space-y-4 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Internships
          </h2>
          {internships.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-medium text-zinc-900">
                  {item.role} <span className="text-zinc-400 font-light">{item.company && `at ${item.company}`}</span>
                </span>
                <span className="text-[11px] text-zinc-400 font-light">
                  {item.startDate} {item.startDate && (item.endDate || item.isCurrent) && "—"}{" "}
                  {item.isCurrent ? "Present" : item.endDate}
                </span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="space-y-1 text-zinc-600 font-light pl-3 border-l border-zinc-100 text-[11px]">
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
        <section className="space-y-3 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Education
          </h2>
          {education.map((item) => (
            <div key={item.id} className="flex justify-between items-baseline text-xs">
              <div>
                <span className="font-medium text-zinc-900">{item.institution}</span>
                <div className="text-[11px] text-zinc-500 font-light">
                  {item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`} {item.gpa && `• GPA: ${item.gpa}`}
                </div>
              </div>
              <span className="text-[11px] text-zinc-400 font-light">
                {item.startDate} {item.startDate && item.endDate && "—"} {item.endDate}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="space-y-3 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Projects
          </h2>
          {projects.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="font-medium text-zinc-900">{item.title}</div>
              {item.technologies.filter(Boolean).length > 0 && (
                <div className="text-[10px] text-zinc-400">{item.technologies.filter(Boolean).join(" · ")}</div>
              )}
              {item.description && <p className="text-[11px] text-zinc-600 font-light">{item.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="space-y-2 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Skills
          </h2>
          <div className="space-y-1 text-xs">
            {skills.map((item) => (
              <div key={item.id} className="text-[11px]">
                {item.categoryName && <span className="font-medium text-zinc-900">{item.categoryName}: </span>}
                <span className="text-zinc-600 font-light">{item.skills.filter(Boolean).join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Certifications */}
      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        {certifications.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Certifications</h2>
            {certifications.map((c) => (
              <div key={c.id} className="text-[11px] text-zinc-700">
                {c.name} {c.issuer && <span className="text-zinc-400">({c.issuer})</span>}
              </div>
            ))}
          </section>
        )}

        {languages.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Languages</h2>
            <div className="text-[11px] text-zinc-700">
              {languages.map((l) => l.language).join(", ")}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
