import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

export const TemplateTwoColumnModern: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, education, experience, internships, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-white text-slate-800 rounded-xl shadow-sm border border-slate-200 min-h-[750px] text-xs font-sans grid grid-cols-1 md:grid-cols-12 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="md:col-span-4 bg-slate-100 p-6 border-r border-slate-200 space-y-5">
        {personalInfo.fullName && (
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
              {personalInfo.fullName}
            </h1>
          </div>
        )}

        <div className="space-y-2 text-[11px] text-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Contact
          </h3>
          {personalInfo.email && <div className="flex items-center gap-1.5 break-all"><Mail className="h-3 w-3 text-slate-500 shrink-0" />{personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-500 shrink-0" />{personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-500 shrink-0" />{personalInfo.location}</div>}
          {personalInfo.linkedin && <div className="flex items-center gap-1.5 break-all"><Linkedin className="h-3 w-3 text-slate-500 shrink-0" />{personalInfo.linkedin}</div>}
          {personalInfo.github && <div className="flex items-center gap-1.5 break-all"><Github className="h-3 w-3 text-slate-500 shrink-0" />{personalInfo.github}</div>}
          {personalInfo.portfolio && <div className="flex items-center gap-1.5 break-all"><Globe className="h-3 w-3 text-slate-500 shrink-0" />{personalInfo.portfolio}</div>}
        </div>

        {/* Education Sidebar */}
        {education.length > 0 && (
          <div className="space-y-2 text-[11px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Education
            </h3>
            {education.map((e) => (
              <div key={e.id} className="space-y-0.5">
                <div className="font-bold text-slate-900">{e.degree}</div>
                <div className="text-slate-700">{e.institution}</div>
                <div className="text-slate-500 text-[10px]">{e.startDate} – {e.endDate}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Sidebar */}
        {skills.length > 0 && (
          <div className="space-y-2 text-[11px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Skills
            </h3>
            {skills.map((s) => (
              <div key={s.id}>
                {s.categoryName && <div className="font-semibold text-slate-900">{s.categoryName}</div>}
                <div className="text-slate-700">{s.skills.filter(Boolean).join(", ")}</div>
              </div>
            ))}
          </div>
        )}

        {/* Languages Sidebar */}
        {languages.length > 0 && (
          <div className="space-y-1 text-[11px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Languages
            </h3>
            {languages.map((l) => (
              <div key={l.id} className="text-slate-700">
                {l.language} {l.proficiency && `(${l.proficiency})`}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Right Column */}
      <main className="md:col-span-8 p-6 space-y-5">
        {summary && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Profile Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-[11px]">{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Work Experience
            </h2>
            {experience.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{item.position} — <span className="text-slate-700">{item.company}</span></span>
                  <span className="text-slate-500 text-[10px]">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
                </div>
                {item.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside text-slate-700 text-[11px] space-y-0.5">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Projects
            </h2>
            {projects.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="font-bold text-slate-900">{item.title}</div>
                {item.description && <p className="text-slate-700 text-[11px]">{item.description}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};
