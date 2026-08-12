import React from "react";
import { CandidateProfile, ConnectedProfiles, ResumeTemplateId } from "../../lib/resume/types";

interface ResumeTemplatesProps {
  profile: CandidateProfile;
  connected?: ConnectedProfiles;
  templateId: ResumeTemplateId;
}

export const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({ profile, connected, templateId }) => {
  if (templateId === "professional-classic") {
    return (
      <div
        id="resume-document-node"
        className="font-serif text-slate-900 leading-relaxed text-xs p-10 bg-white shadow-none space-y-5 max-w-[800px] mx-auto border border-slate-200"
      >
        {/* Classic Centered Header */}
        <div className="text-center border-b border-slate-900 pb-4 space-y-1">
          <h1 className="text-2xl font-bold tracking-widest uppercase text-slate-900">{profile.name}</h1>
          <p className="text-xs text-slate-700 font-sans">
            {profile.location} &nbsp;•&nbsp; {profile.email} &nbsp;•&nbsp; {profile.phone}
          </p>
          <div className="text-[11px] text-blue-800 font-sans space-x-3 pt-0.5">
            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="underline">{profile.linkedinUrl}</a>}
            {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="underline">{profile.githubUrl}</a>}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-normal">{profile.summary}</p>
        </div>

        {/* Technical Qualifications */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
            Technical Qualifications
          </h2>
          <div className="text-xs space-y-1 text-slate-800 font-sans">
            <p><strong className="font-serif">Languages:</strong> {profile.skills.languages.join(", ")}</p>
            <p><strong className="font-serif">Frameworks & Libraries:</strong> {profile.skills.frameworks.join(", ")}</p>
            <p><strong className="font-serif">Databases & Cloud:</strong> {profile.skills.databases.join(", ")}</p>
            <p><strong className="font-serif">Developer Tools:</strong> {profile.skills.tools.join(", ")}</p>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
            Experience
          </h2>
          <div className="space-y-3">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between font-bold text-xs text-slate-900">
                  <span>{exp.role} &nbsp;—&nbsp; {exp.company}</span>
                  <span className="font-normal text-slate-700">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-[11px] text-slate-600 italic">{exp.location}</div>
                <ul className="list-disc list-outside ml-4 text-xs text-slate-800 space-y-1 font-sans">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
            Technical Projects
          </h2>
          <div className="space-y-3">
            {profile.projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between font-bold text-xs text-slate-900">
                  <span>{proj.title}</span>
                  <span className="font-normal text-slate-600 font-sans text-[11px]">{proj.techStack.join(", ")}</span>
                </div>
                <p className="text-xs text-slate-800 font-sans">{proj.description}</p>
                <ul className="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5 font-sans">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
            Education
          </h2>
          {profile.education.map((edu) => (
            <div key={edu.id} className="flex justify-between text-xs text-slate-900 font-sans">
              <div>
                <span className="font-bold font-serif">{edu.degree}</span> — {edu.institution}
              </div>
              <div>{edu.graduationYear} ({edu.score})</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (templateId === "tech-focused") {
    return (
      <div
        id="resume-document-node"
        className="font-sans text-slate-900 leading-normal text-xs p-9 bg-white shadow-none space-y-4 max-w-[800px] mx-auto border border-slate-200"
      >
        {/* Tech Header */}
        <div className="border-l-4 border-blue-600 pl-4 py-1 space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">{profile.name}</h1>
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Software Engineering & AI Developer</p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-1">
            <span>{profile.email}</span>
            <span>•</span>
            <span>{profile.phone}</span>
            <span>•</span>
            <span>{profile.location}</span>
          </div>
        </div>

        {/* Live Verified Badges (GitHub / LeetCode) */}
        {connected && (connected.github.connected || connected.leetcode.connected) && (
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            {connected.github.connected && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">GitHub Verified:</span>
                <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                  {connected.github.publicReposCount} Repos | {connected.github.totalStars} Stars
                </span>
              </div>
            )}
            {connected.leetcode.connected && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">LeetCode Solved:</span>
                <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                  {connected.leetcode.totalSolved} Solved ({connected.leetcode.mediumSolved} Medium / {connected.leetcode.hardSolved} Hard)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="space-y-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-0.5">
            01 // Summary
          </h2>
          <p className="text-slate-800 leading-relaxed text-xs">{profile.summary}</p>
        </div>

        {/* Skills Matrix */}
        <div className="space-y-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-0.5">
            02 // Technical Skills
          </h2>
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-900">Languages:</span>{" "}
              <span className="text-slate-800">{profile.skills.languages.join(", ")}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Frameworks:</span>{" "}
              <span className="text-slate-800">{profile.skills.frameworks.join(", ")}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Databases:</span>{" "}
              <span className="text-slate-800">{profile.skills.databases.join(", ")}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Tools:</span>{" "}
              <span className="text-slate-800">{profile.skills.tools.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-0.5">
            03 // Featured Projects
          </h2>
          <div className="space-y-2.5">
            {profile.projects.map((proj) => (
              <div key={proj.id} className="border-l-2 border-slate-300 pl-3 space-y-0.5">
                <div className="flex justify-between font-bold text-slate-900 text-xs">
                  <span>{proj.title}</span>
                  <span className="text-blue-600 font-mono text-[11px] font-semibold">{proj.techStack.join(" · ")}</span>
                </div>
                <p className="text-slate-700 text-xs">{proj.description}</p>
                <ul className="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-0.5">
            04 // Experience
          </h2>
          <div className="space-y-2.5">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-900 text-xs">
                  <span>{exp.role} @ {exp.company}</span>
                  <span className="text-slate-600 font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside ml-4 text-xs text-slate-800 space-y-0.5">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "executive-clean") {
    return (
      <div
        id="resume-document-node"
        className="font-sans text-slate-900 leading-normal text-xs p-9 bg-white shadow-none space-y-5 max-w-[800px] mx-auto border border-slate-200"
      >
        {/* Executive Header */}
        <div className="flex justify-between items-end border-b-2 border-slate-900 pb-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h1>
            <p className="text-xs font-semibold text-slate-600">{profile.location}</p>
          </div>
          <div className="text-right text-xs text-slate-700 space-y-0.5">
            <p className="font-medium">{profile.email}</p>
            <p>{profile.phone}</p>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-1.5 px-2.5">Executive Summary</h2>
          <p className="text-slate-800 leading-relaxed px-1 text-xs">{profile.summary}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-1.5 px-2.5">Professional Experience</h2>
          <div className="space-y-3 px-1">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-900 text-xs">
                  <span>{exp.role} &nbsp;|&nbsp; {exp.company}</span>
                  <span className="text-slate-600 font-medium">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside ml-4 text-slate-800 space-y-1 text-xs">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-1.5 px-2.5">Core Competencies</h2>
          <div className="px-1 text-slate-800 space-y-1 text-xs">
            <p><strong>Languages & Systems:</strong> {profile.skills.languages.join(" • ")}</p>
            <p><strong>Frameworks:</strong> {profile.skills.frameworks.join(" • ")}</p>
            <p><strong>Databases:</strong> {profile.skills.databases.join(" • ")}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-1.5 px-2.5">Education & Credentials</h2>
          <div className="px-1 space-y-1 text-xs">
            {profile.education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-slate-900">
                <span className="font-bold">{edu.degree} — {edu.institution}</span>
                <span className="text-slate-600">{edu.graduationYear} ({edu.score})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: Modern Minimalist (Ultra Clean ATS Standard Layout)
  return (
    <div
      id="resume-document-node"
      className="font-sans text-slate-900 leading-relaxed text-xs p-10 bg-white shadow-none space-y-5 max-w-[800px] mx-auto border border-slate-200"
    >
      {/* Modern Minimal Header */}
      <div className="flex justify-between items-start border-b border-slate-300 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
          <p className="text-xs text-blue-600 font-semibold">{profile.location}</p>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          <p className="font-medium text-slate-900">{profile.email}</p>
          <p>{profile.phone}</p>
          {profile.githubUrl && <p className="text-blue-600">{profile.githubUrl}</p>}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
          Professional Summary
        </h2>
        <p className="text-slate-800 leading-normal text-xs">{profile.summary}</p>
      </div>

      {/* Technical Skills */}
      <div className="space-y-1.5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
          Skills & Technologies
        </h2>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {[...profile.skills.languages, ...profile.skills.frameworks, ...profile.skills.databases, ...profile.skills.tools].map((skill) => (
            <span
              key={skill}
              className="bg-slate-100 text-slate-900 border border-slate-300 px-2.5 py-0.5 rounded text-[11px] font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
          Work Experience
        </h2>
        <div className="space-y-3">
          {profile.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between font-bold text-xs text-slate-900">
                <span>{exp.role} &nbsp;<span className="font-normal text-slate-600">at {exp.company}</span></span>
                <span className="text-slate-600 text-[11px] font-normal">{exp.startDate} – {exp.endDate}</span>
              </div>
              <ul className="list-disc list-outside ml-4 text-slate-800 text-xs space-y-1">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-2">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
          Key Projects
        </h2>
        <div className="space-y-3">
          {profile.projects.map((proj) => (
            <div key={proj.id} className="space-y-1">
              <div className="flex justify-between font-bold text-xs text-slate-900">
                <span>{proj.title}</span>
                <span className="text-slate-600 text-[11px] font-semibold">{proj.techStack.join(", ")}</span>
              </div>
              <p className="text-slate-700 text-xs">{proj.description}</p>
              <ul className="list-disc list-outside ml-4 text-slate-800 text-xs space-y-0.5">
                {proj.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Achievements */}
      <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-300">
        <div className="space-y-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Education
          </h2>
          {profile.education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <p className="font-bold text-slate-900">{edu.degree}</p>
              <p className="text-[11px] text-slate-600">{edu.institution} ({edu.graduationYear})</p>
              <p className="text-[11px] font-semibold text-slate-800">{edu.score}</p>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-0.5">
            Achievements
          </h2>
          <ul className="list-disc list-outside ml-4 text-slate-800 text-[11px] space-y-1">
            {profile.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
