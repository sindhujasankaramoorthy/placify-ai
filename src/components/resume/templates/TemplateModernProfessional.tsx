import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from "lucide-react";

export const TemplateModernProfessional: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, education, experience, internships, projects, skills, certifications, achievements, languages } = data;

  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin || personalInfo.github || personalInfo.portfolio;

  return (
    <div className="w-full bg-white text-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 min-h-[750px] text-xs font-sans space-y-5">
      {/* Header */}
      <header className="border-b-2 border-blue-600 pb-4">
        {personalInfo.fullName && (
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            {personalInfo.fullName}
          </h1>
        )}
        {hasContact && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-slate-600 text-[11px]">
            {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-blue-600" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-blue-600" />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-blue-600" />{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-3 w-3 text-blue-600" />{personalInfo.linkedin}</span>}
            {personalInfo.github && <span className="flex items-center gap-1"><Github className="h-3 w-3 text-blue-600" />{personalInfo.github}</span>}
            {personalInfo.portfolio && <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-blue-600" />{personalInfo.portfolio}</span>}
          </div>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Work Experience
          </h2>
          {experience.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-semibold text-slate-900">
                <span>{item.position} {item.company && `| ${item.company}`}</span>
                <span className="text-slate-500 font-normal text-[11px]">{item.startDate} {item.startDate && (item.endDate || item.isCurrent) && "–"} {item.isCurrent ? "Present" : item.endDate}</span>
              </div>
              {item.location && <div className="text-[11px] text-slate-500">{item.location}</div>}
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

      {/* Internships */}
      {internships.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Internships
          </h2>
          {internships.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-semibold text-slate-900">
                <span>{item.role} {item.company && `| ${item.company}`}</span>
                <span className="text-slate-500 font-normal text-[11px]">{item.startDate} {item.startDate && (item.endDate || item.isCurrent) && "–"} {item.isCurrent ? "Present" : item.endDate}</span>
              </div>
              {item.location && <div className="text-[11px] text-slate-500">{item.location}</div>}
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Education
          </h2>
          {education.map((item) => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-semibold text-slate-900">
                <span>{item.institution} {item.location && `(${item.location})`}</span>
                <span className="text-slate-500 font-normal text-[11px]">{item.startDate} {item.startDate && item.endDate && "–"} {item.endDate}</span>
              </div>
              <div className="text-slate-700 text-[11px]">
                {item.degree} {item.fieldOfStudy && `in ${item.fieldOfStudy}`}
                {item.gpa && <span className="ml-2 font-medium text-slate-600">• GPA: {item.gpa}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Projects
          </h2>
          {projects.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span className="flex items-center gap-2">
                  {item.title}
                  {item.githubLink && <a href={item.githubLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 inline-flex items-center gap-0.5 text-[11px] font-normal">[Code <ExternalLink className="h-2.5 w-2.5" />]</a>}
                  {item.liveLink && <a href={item.liveLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 inline-flex items-center gap-0.5 text-[11px] font-normal">[Demo <ExternalLink className="h-2.5 w-2.5" />]</a>}
                </span>
              </div>
              {item.technologies.filter(Boolean).length > 0 && (
                <div className="text-[11px] text-slate-600 italic">Tech: {item.technologies.filter(Boolean).join(", ")}</div>
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
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Skills & Technical Strengths
          </h2>
          <div className="space-y-1">
            {skills.map((item) => (
              <div key={item.id} className="text-[11px]">
                {item.categoryName && <span className="font-semibold text-slate-900">{item.categoryName}: </span>}
                <span className="text-slate-700">{item.skills.filter(Boolean).join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements & Languages */}
      <div className="grid gap-4 sm:grid-cols-2">
        {certifications.length > 0 && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
              Certifications
            </h2>
            {certifications.map((item) => (
              <div key={item.id} className="text-[11px]">
                <span className="font-semibold text-slate-900">{item.name}</span>
                {item.issuer && <span className="text-slate-600"> — {item.issuer}</span>}
              </div>
            ))}
          </section>
        )}

        {languages.length > 0 && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-700">
              {languages.map((item) => (
                <span key={item.id}>
                  <span className="font-semibold text-slate-900">{item.language}</span>
                  {item.proficiency && <span className="text-slate-500"> ({item.proficiency})</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {achievements.length > 0 && (
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Achievements & Awards
          </h2>
          {achievements.map((item) => (
            <div key={item.id} className="text-[11px]">
              <span className="font-semibold text-slate-900">{item.title}</span>
              {item.date && <span className="text-slate-500 font-normal"> ({item.date})</span>}
              {item.description && <p className="text-slate-600">{item.description}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
