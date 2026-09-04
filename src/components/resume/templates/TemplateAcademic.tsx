import React from "react";
import { ResumeData } from "@/types/resume";

export const TemplateAcademic: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="w-full bg-white text-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 min-h-[750px] text-xs font-serif leading-relaxed space-y-5">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
        {personalInfo.fullName && (
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {personalInfo.fullName}
          </h1>
        )}
        {contactList.length > 0 && (
          <div className="text-[11px] text-slate-700 italic">
            {contactList.join("  |  ")}
          </div>
        )}
      </header>

      {/* Academic Profile */}
      {summary && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
            Academic Profile & Research Interests
          </h2>
          <p className="text-slate-800 text-[11px] leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Education (Centered in Academic CVs) */}
      {education.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
            Education
          </h2>
          {education.map((item) => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex justify-between font-bold text-slate-900 text-xs">
                <span>{item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}</span>
                <span>{item.startDate} – {item.endDate}</span>
              </div>
              <div className="text-slate-800 text-[11px] italic">
                {item.institution} {item.location && `, ${item.location}`} {item.gpa && `• GPA: ${item.gpa}`}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects & Research */}
      {projects.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
            Research & Academic Projects
          </h2>
          {projects.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="font-bold text-slate-900 text-xs">{item.title}</div>
              {item.description && <p className="text-slate-800 text-[11px]">{item.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Teaching & Work Experience */}
      {(experience.length > 0 || internships.length > 0) && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
            Teaching & Professional Appointments
          </h2>
          {experience.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900 text-xs">
                <span>{item.position}, {item.company}</span>
                <span>{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside text-slate-800 text-[11px]">
                  {item.bullets.filter(Boolean).map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Honors & Awards */}
      {achievements.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
            Honors, Awards & Grants
          </h2>
          {achievements.map((item) => (
            <div key={item.id} className="flex justify-between text-[11px]">
              <span className="font-bold text-slate-900">{item.title}</span>
              <span className="text-slate-600">{item.date}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
