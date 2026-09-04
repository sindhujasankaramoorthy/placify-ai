import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, GraduationCap, FolderGit2 } from "lucide-react";

export const TemplateStudentFresher: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, education, experience, internships, projects, skills, certifications, achievements, languages } = data;

  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin || personalInfo.github || personalInfo.portfolio;

  return (
    <div className="w-full bg-white text-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 min-h-[750px] text-xs font-sans space-y-5">
      {/* Header */}
      <header className="border-b border-indigo-200 pb-4 text-center">
        {personalInfo.fullName && (
          <h1 className="text-2xl font-extrabold text-indigo-900 tracking-tight">
            {personalInfo.fullName}
          </h1>
        )}
        {hasContact && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-600 text-[11px]">
            {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-indigo-600" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-indigo-600" />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-indigo-600" />{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-3 w-3 text-indigo-600" />{personalInfo.linkedin}</span>}
            {personalInfo.github && <span className="flex items-center gap-1"><Github className="h-3 w-3 text-indigo-600" />{personalInfo.github}</span>}
            {personalInfo.portfolio && <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-indigo-600" />{personalInfo.portfolio}</span>}
          </div>
        )}
      </header>

      {/* Objective / Summary */}
      {summary && (
        <section className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Career Objective</h2>
          <p className="text-slate-700 text-[11px] leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Education (Prioritized at Top) */}
      {education.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-indigo-600" /> Education & Qualifications
          </h2>
          <div className="grid gap-2">
            {education.map((item) => (
              <div key={item.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}</div>
                  <div className="text-slate-700 text-[11px]">{item.institution} {item.location && `(${item.location})`}</div>
                  {item.gpa && <div className="text-[10px] font-semibold text-indigo-700 mt-0.5">Grade/GPA: {item.gpa}</div>}
                </div>
                <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap bg-white px-2 py-0.5 rounded border border-slate-200">
                  {item.startDate} {item.startDate && item.endDate && "–"} {item.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects (Prioritized for Freshers) */}
      {projects.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5 flex items-center gap-1.5">
            <FolderGit2 className="h-4 w-4 text-indigo-600" /> Key Projects
          </h2>
          {projects.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>{item.title}</span>
                {item.githubLink && <a href={item.githubLink} target="_blank" rel="noreferrer" className="text-indigo-600 text-[10px] font-normal hover:underline">[GitHub]</a>}
              </div>
              {item.technologies.filter(Boolean).length > 0 && (
                <div className="text-[10px] text-indigo-700 font-medium">Tech Stack: {item.technologies.filter(Boolean).join(", ")}</div>
              )}
              {item.description && <p className="text-[11px] text-slate-700">{item.description}</p>}
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1 text-[11px]">
                  {item.bullets.filter(Boolean).map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Internships & Experience */}
      {(internships.length > 0 || experience.length > 0) && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5">
            Practical Experience & Internships
          </h2>
          {internships.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-semibold text-slate-900">
                <span>{item.role} {item.company && `at ${item.company}`}</span>
                <span className="text-slate-500 font-normal text-[10px]">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside text-[11px] text-slate-700 pl-1">
                  {item.bullets.filter(Boolean).map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {experience.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-semibold text-slate-900">
                <span>{item.position} {item.company && `at ${item.company}`}</span>
                <span className="text-slate-500 font-normal text-[10px]">{item.startDate} – {item.isCurrent ? "Present" : item.endDate}</span>
              </div>
              {item.bullets.filter(Boolean).length > 0 && (
                <ul className="list-disc list-inside text-[11px] text-slate-700 pl-1">
                  {item.bullets.filter(Boolean).map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5">
            Technical Skills & Interests
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {skills.map((item) => (
              <div key={item.id} className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px]">
                {item.categoryName && <div className="font-bold text-indigo-900">{item.categoryName}</div>}
                <div className="text-slate-700">{item.skills.filter(Boolean).join(", ")}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5">Certifications</h2>
              {certifications.map((c) => (
                <div key={c.id} className="text-[11px] text-slate-800">
                  <span className="font-semibold">{c.name}</span> {c.issuer && <span className="text-slate-500">({c.issuer})</span>}
                </div>
              ))}
            </section>
          )}

          {achievements.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-0.5">Achievements</h2>
              {achievements.map((a) => (
                <div key={a.id} className="text-[11px] text-slate-800">
                  <span className="font-semibold">{a.title}</span> {a.date && <span className="text-slate-500">({a.date})</span>}
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
};
