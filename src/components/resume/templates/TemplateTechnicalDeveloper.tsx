import React from "react";
import { ResumeData } from "@/types/resume";
import { Terminal, Code, GitBranch, Globe, Mail, Phone, MapPin } from "lucide-react";

export const TemplateTechnicalDeveloper: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, education, experience, internships, projects, skills, certifications, achievements, languages } = data;

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-xl p-8 shadow-md border border-slate-800 min-h-[750px] text-xs font-mono space-y-5">
      {/* Header */}
      <header className="border-b border-emerald-500/40 pb-4">
        {personalInfo.fullName && (
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400 flex items-center gap-2">
            <Terminal className="h-6 w-6 text-emerald-400" />
            {personalInfo.fullName}
          </h1>
        )}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-[11px]">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-emerald-400" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-emerald-400" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-emerald-400" />{personalInfo.location}</span>}
          {personalInfo.github && <span className="flex items-center gap-1 text-emerald-400"><GitBranch className="h-3 w-3" />{personalInfo.github}</span>}
          {personalInfo.portfolio && <span className="flex items-center gap-1 text-emerald-400"><Globe className="h-3 w-3" />{personalInfo.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-1 bg-slate-900/60 p-3 rounded border border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Code className="h-3.5 w-3.5" /> // Summary
          </h2>
          <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{summary}</p>
        </section>
      )}

      {/* Tech Skills Matrix */}
      {skills.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">// Tech_Stack_Matrix</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {skills.map((item) => (
              <div key={item.id} className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                {item.categoryName && <div className="text-emerald-400 text-[11px] font-bold">{item.categoryName}</div>}
                <div className="flex flex-wrap gap-1">
                  {item.skills.filter(Boolean).map((s, idx) => (
                    <span key={idx} className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">// Work_Experience</h2>
          {experience.map((item) => (
            <div key={item.id} className="space-y-1 border-l-2 border-slate-800 pl-3">
              <div className="flex justify-between font-bold text-slate-100">
                <span>{item.position} <span className="text-emerald-400">@{item.company}</span></span>
                <span className="text-slate-500 text-[10px]">{item.startDate} – {item.isCurrent ? "NOW" : item.endDate}</span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside text-slate-300 font-sans text-[11px] space-y-0.5">
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
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">// Featured_Repositories</h2>
          <div className="grid gap-2">
            {projects.map((item) => (
              <div key={item.id} className="bg-slate-900/90 p-3 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold text-slate-100">
                  <span className="text-emerald-300">{item.title}</span>
                  {item.githubLink && <a href={item.githubLink} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-emerald-400">[Repo]</a>}
                </div>
                {item.technologies.filter(Boolean).length > 0 && (
                  <div className="text-[10px] text-slate-400">Tech: [{item.technologies.filter(Boolean).join(", ")}]</div>
                )}
                {item.description && <p className="text-[11px] text-slate-300 font-sans">{item.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">// Education</h2>
          {education.map((item) => (
            <div key={item.id} className="flex justify-between text-slate-300">
              <div>
                <span className="font-bold text-slate-100">{item.degree}</span> in {item.fieldOfStudy} — <span className="text-slate-400">{item.institution}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{item.startDate} – {item.endDate}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
