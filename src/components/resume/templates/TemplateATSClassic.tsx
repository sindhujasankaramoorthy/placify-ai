import React from "react";
import { ResumeData } from "@/types/resume";

export const TemplateATSClassic: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="w-full bg-white text-black rounded-xl p-8 shadow-sm border border-slate-200 min-h-[750px] text-xs font-serif leading-relaxed space-y-4">
      {/* Header */}
      {(personalInfo.fullName || contactList.length > 0) && (
        <header className="text-center border-b border-black pb-3">
          {personalInfo.fullName && (
            <h1 className="text-xl font-bold uppercase tracking-widest text-black mb-1">
              {personalInfo.fullName}
            </h1>
          )}
          {contactList.length > 0 && (
            <div className="text-[11px] text-black">
              {contactList.join("  |  ")}
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black mb-1 pb-0.5">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-[11px] text-black leading-normal">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black mb-2 pb-0.5">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3">
            {experience.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between font-bold text-black text-xs">
                  <span>{item.position}{item.company ? `, ${item.company}` : ""}</span>
                  <span>{item.startDate} {item.startDate && (item.endDate || item.isCurrent) ? "–" : ""} {item.isCurrent ? "Present" : item.endDate}</span>
                </div>
                {item.location && <div className="italic text-[10px] text-black mb-1">{item.location}</div>}
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1">
                    {item.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Internships */}
      {internships.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black mb-2 pb-0.5">
            INTERNSHIPS
          </h2>
          <div className="space-y-3">
            {internships.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between font-bold text-black text-xs">
                  <span>{item.role}{item.company ? `, ${item.company}` : ""}</span>
                  <span>{item.startDate} {item.startDate && (item.endDate || item.isCurrent) ? "–" : ""} {item.isCurrent ? "Present" : item.endDate}</span>
                </div>
                {item.location && <div className="italic text-[10px] text-black mb-1">{item.location}</div>}
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1">
                    {item.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black mb-2 pb-0.5">
            EDUCATION
          </h2>
          <div className="space-y-2">
            {education.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between font-bold text-black text-xs">
                  <span>{item.institution}{item.location ? ` — ${item.location}` : ""}</span>
                  <span>{item.startDate} {item.startDate && item.endDate ? "–" : ""} {item.endDate}</span>
                </div>
                <div className="text-[11px] italic">
                  {item.degree}{item.fieldOfStudy ? ` in ${item.fieldOfStudy}` : ""} {item.gpa ? `(GPA: ${item.gpa})` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black mb-2 pb-0.5">
            PROJECTS
          </h2>
          <div className="space-y-2">
            {projects.map((item) => (
              <div key={item.id}>
                <div className="font-bold text-xs">{item.title}</div>
                {item.technologies.filter(Boolean).length > 0 && (
                  <div className="text-[10px] italic">Technologies: {item.technologies.filter(Boolean).join(", ")}</div>
                )}
                {item.description && <p className="text-[11px]">{item.description}</p>}
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1">
                    {item.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black mb-1 pb-0.5">
            SKILLS
          </h2>
          <div className="space-y-0.5 text-[11px]">
            {skills.map((item) => (
              <div key={item.id}>
                {item.categoryName && <span className="font-bold">{item.categoryName}: </span>}
                <span>{item.skills.filter(Boolean).join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black mb-1 pb-0.5">
            CERTIFICATIONS
          </h2>
          <div className="text-[11px] space-y-0.5">
            {certifications.map((item) => (
              <div key={item.id}>
                <span className="font-bold">{item.name}</span>
                {item.issuer && <span> — {item.issuer}</span>}
                {item.issueDate && <span> ({item.issueDate})</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black mb-1 pb-0.5">
            LANGUAGES
          </h2>
          <div className="text-[11px]">
            {languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(", ")}
          </div>
        </section>
      )}
    </div>
  );
};
