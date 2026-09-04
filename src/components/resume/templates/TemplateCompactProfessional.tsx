import React from "react";
import { ResumeData } from "@/types/resume";

export const TemplateCompactProfessional: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="w-full bg-white text-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 min-h-[750px] text-[10.5px] font-sans leading-tight space-y-3">
      {/* Compact Header */}
      <header className="border-b border-slate-900 pb-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <div>
          {personalInfo.fullName && (
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
              {personalInfo.fullName}
            </h1>
          )}
        </div>
        {contactItems.length > 0 && (
          <div className="text-[10px] text-slate-600 flex flex-wrap gap-x-2.5 gap-y-0.5">
            {contactItems.join(" • ")}
          </div>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-0.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-normal">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="space-y-0.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Skills & Core Competencies
          </h2>
          <div className="space-y-0.5">
            {skills.map((item) => (
              <div key={item.id}>
                {item.categoryName && <span className="font-semibold text-slate-900">{item.categoryName}: </span>}
                <span className="text-slate-700">{item.skills.filter(Boolean).join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Work Experience
          </h2>
          {experience.map((item) => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{item.position} — <span className="text-slate-700 font-semibold">{item.company}</span></span>
                <span className="text-slate-500 font-normal text-[10px]">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
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
        <section className="space-y-2">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Internships
          </h2>
          {internships.map((item) => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{item.role} — <span className="text-slate-700 font-semibold">{item.company}</span></span>
                <span className="text-slate-500 font-normal text-[10px]">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                  {item.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Key Projects
          </h2>
          {projects.map((item) => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{item.title}</span>
                {item.technologies.filter(Boolean).length > 0 && (
                  <span className="text-[9.5px] font-normal text-slate-500 italic">[{item.technologies.filter(Boolean).join(", ")}]</span>
                )}
              </div>
              {item.description && <p className="text-slate-700">{item.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="space-y-1.5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
            Education
          </h2>
          {education.map((item) => (
            <div key={item.id} className="flex justify-between text-slate-800">
              <div>
                <span className="font-bold">{item.institution}</span> — {item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`} {item.gpa && `(GPA: ${item.gpa})`}
              </div>
              <span className="text-slate-500 text-[10px]">{item.startDate} – {item.endDate}</span>
            </div>
          ))}
        </section>
      )}

      {/* Certifications & Languages */}
      <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-slate-100">
        {certifications.length > 0 && (
          <div>
            <span className="font-bold text-slate-900">Certifications: </span>
            <span className="text-slate-700">{certifications.map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ""}`).join("; ")}</span>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <span className="font-bold text-slate-900">Languages: </span>
            <span className="text-slate-700">{languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
};
