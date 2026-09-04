import React from "react";
import { ResumeData } from "@/types/resume";
import { ExternalLink } from "lucide-react";

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
          <div className="space-y-2">
            {education.map((item) => (
              <div key={item.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{item.institution} {item.location && `(${item.location})`}</span>
                  <span className="font-normal text-[11px] text-slate-600">{item.startDate} {item.startDate && item.endDate && "–"} {item.endDate}</span>
                </div>
                <div className="text-[11px] text-slate-800">
                  <span className="italic">{item.degree}</span> {item.fieldOfStudy && `in ${item.fieldOfStudy}`}
                  {item.gpa && <span className="ml-2 font-medium text-slate-600">• Cumulative GPA: {item.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research & Academic Projects */}
      {projects.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
            Research & Academic Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                  <span className="flex items-center gap-2">
                    {item.title}
                    {item.githubLink && <a href={item.githubLink} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 font-normal text-[10px] inline-flex items-center gap-0.5">[Repository <ExternalLink className="h-2.5 w-2.5" />]</a>}
                    {item.liveLink && <a href={item.liveLink} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 font-normal text-[10px] inline-flex items-center gap-0.5">[Publication / Demo <ExternalLink className="h-2.5 w-2.5" />]</a>}
                  </span>
                </div>
                {item.technologies.filter(Boolean).length > 0 && (
                  <div className="text-[10.5px] italic text-slate-600">Methodologies / Tools: {item.technologies.filter(Boolean).join(", ")}</div>
                )}
                {item.description && <p className="text-[11px] text-slate-700">{item.description}</p>}
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 text-[11px]">
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

      {/* Teaching & Professional Appointments */}
      {(experience.length > 0 || internships.length > 0) && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
            Teaching & Professional Appointments
          </h2>
          <div className="space-y-2.5">
            {experience.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{item.position} — <span className="italic font-normal">{item.company}</span></span>
                  <span className="font-normal text-[11px] text-slate-600">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
                </div>
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 text-[11px]">
                    {item.bullets.filter(Boolean).map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {internships.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{item.role} — <span className="italic font-normal">{item.company}</span></span>
                  <span className="font-normal text-[11px] text-slate-600">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
                </div>
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 text-[11px]">
                    {item.bullets.filter(Boolean).map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Scholarly Competencies */}
      {skills.length > 0 && (
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
            Scholarly & Technical Competencies
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

      {/* Certifications & Honors & Languages */}
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">Honors & Awards</h2>
            {achievements.map((a) => (
              <div key={a.id} className="text-[11px] text-slate-800">
                <span className="font-bold">{a.title}</span> {a.date && <span className="text-slate-600">({a.date})</span>}
                {a.description && <p className="text-slate-600 text-[10.5px] italic">{a.description}</p>}
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">Certifications & Licenses</h2>
            {certifications.map((c) => (
              <div key={c.id} className="text-[11px] text-slate-800">
                <span className="font-bold">{c.name}</span> {c.issuer && <span className="text-slate-600">— {c.issuer}</span>}
              </div>
            ))}
          </section>
        )}
      </div>

      {languages.length > 0 && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">Language Proficiencies</h2>
          <div className="text-[11px] text-slate-800">
            {languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(", ")}
          </div>
        </section>
      )}
    </div>
  );
};
