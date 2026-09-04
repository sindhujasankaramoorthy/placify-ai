import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from "lucide-react";

export const TemplateCreativeProfessional: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, education, experience, internships, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-white text-slate-800 rounded-xl shadow-sm border border-slate-200 min-h-[750px] text-xs font-sans grid grid-cols-1 md:grid-cols-12 overflow-hidden">
      {/* Sidebar (Left Column - Teal/Slate Theme) */}
      <aside className="md:col-span-4 bg-slate-900 text-slate-100 p-6 space-y-5 flex flex-col justify-between">
        <div className="space-y-5">
          {personalInfo.fullName && (
            <div>
              <h1 className="text-xl font-bold tracking-tight text-teal-400">
                {personalInfo.fullName}
              </h1>
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-2 text-[11px] text-slate-300">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
              Contact Info
            </h3>
            {personalInfo.email && <div className="flex items-center gap-1.5 break-all"><Mail className="h-3 w-3 text-teal-400 shrink-0" />{personalInfo.email}</div>}
            {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-teal-400 shrink-0" />{personalInfo.phone}</div>}
            {personalInfo.location && <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-teal-400 shrink-0" />{personalInfo.location}</div>}
            {personalInfo.linkedin && <div className="flex items-center gap-1.5 break-all"><Linkedin className="h-3 w-3 text-teal-400 shrink-0" />{personalInfo.linkedin}</div>}
            {personalInfo.github && <div className="flex items-center gap-1.5 break-all"><Github className="h-3 w-3 text-teal-400 shrink-0" />{personalInfo.github}</div>}
            {personalInfo.portfolio && <div className="flex items-center gap-1.5 break-all"><Globe className="h-3 w-3 text-teal-400 shrink-0" />{personalInfo.portfolio}</div>}
          </div>

          {/* Skills Sidebar */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
                Core Skills
              </h3>
              {skills.map((s) => (
                <div key={s.id} className="space-y-1">
                  {s.categoryName && <div className="text-[11px] font-semibold text-slate-200">{s.categoryName}</div>}
                  <div className="flex flex-wrap gap-1">
                    {s.skills.filter(Boolean).map((sk, idx) => (
                      <span key={idx} className="bg-teal-950 text-teal-300 border border-teal-800/60 px-2 py-0.5 rounded text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-1.5 text-[11px]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
                Certifications
              </h3>
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-semibold text-slate-100">{c.name}</div>
                  {c.issuer && <div className="text-slate-400 text-[10px]">{c.issuer}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="space-y-1.5 text-[11px]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1">
                Languages
              </h3>
              <div className="text-slate-300">
                {languages.map((l) => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join(", ")}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area (Right Column) */}
      <main className="md:col-span-8 p-6 space-y-5 bg-white">
        {summary && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-teal-500 pb-1">
              About Me
            </h2>
            <p className="text-slate-700 leading-relaxed text-[11px]">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-teal-500 pb-1">
              Work Experience
            </h2>
            {experience.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{item.position} — <span className="text-teal-700">{item.company}</span></span>
                  <span className="text-slate-500 text-[10px]">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
                </div>
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside text-slate-700 pl-1 text-[11px] space-y-0.5">
                    {item.bullets.filter(Boolean).map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-teal-500 pb-1">
              Key Projects
            </h2>
            {projects.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>{item.title}</span>
                  {item.liveLink && <a href={item.liveLink} target="_blank" rel="noreferrer" className="text-teal-600 text-[10px] font-normal inline-flex items-center gap-0.5">View Demo <ExternalLink className="h-2.5 w-2.5" /></a>}
                </div>
                {item.description && <p className="text-slate-700 text-[11px]">{item.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-teal-500 pb-1">
              Education
            </h2>
            {education.map((item) => (
              <div key={item.id} className="flex justify-between text-slate-800 text-[11px]">
                <div>
                  <span className="font-bold">{item.institution}</span> — {item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}
                </div>
                <span className="text-slate-500 text-[10px]">{item.startDate} – {item.endDate}</span>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};
