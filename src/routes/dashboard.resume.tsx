import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Link2, FileSpreadsheet, Sparkles, FileEdit, ShieldCheck, CheckCircle2 } from "lucide-react";
import { BaseResume, CandidateProfile, ConnectedProfiles, JobOpportunity, TailoredResume } from "../lib/resume/types";
import { defaultCandidateProfile } from "../lib/resume/parser";
import { initialConnectedProfiles } from "../lib/resume/profileFetcher";
import { sampleJobsDataset } from "../lib/resume/excelParser";
import { generateTailoredResume } from "../lib/resume/tailorEngine";
import { ResumeUploadSection } from "../components/resume/ResumeUploadSection";
import { ConnectedProfilesSection } from "../components/resume/ConnectedProfilesSection";
import { JobDirectorySection } from "../components/resume/JobDirectorySection";
import { JobAnalysisModal } from "../components/resume/JobAnalysisModal";
import { ResumeEditorSection } from "../components/resume/ResumeEditorSection";

export const Route = createFileRoute("/dashboard/resume")({
  head: () => ({
    meta: [
      { title: "Resume AI Studio — Placify AI" },
      { name: "description", content: "AI-powered job description resume tailoring & connected developer profile suite." },
      { property: "og:title", content: "Resume AI Studio — Placify AI" },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  // Global State
  const [activeTab, setActiveTab] = useState<"upload" | "profiles" | "jobs" | "editor">("upload");

  const [baseResume, setBaseResume] = useState<BaseResume>({
    fileName: "Sindhuja_Resume_2026.pdf",
    fileSize: "1.42 MB",
    uploadDate: new Date().toLocaleDateString(),
    rawText: "Parsed candidate resume text",
    status: "parsed",
  });

  const [profile, setProfile] = useState<CandidateProfile>(defaultCandidateProfile);
  const [connectedProfiles, setConnectedProfiles] = useState<ConnectedProfiles>(initialConnectedProfiles);
  const [jobs, setJobs] = useState<JobOpportunity[]>(sampleJobsDataset);

  const [analyzingJob, setAnalyzingJob] = useState<JobOpportunity | null>(null);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);

  // Trigger AI Tailoring Engine
  const handleStartTailoring = (job: JobOpportunity) => {
    setIsTailoring(true);
    setTimeout(() => {
      const result = generateTailoredResume(profile, connectedProfiles, job);
      setTailoredResume(result);
      setIsTailoring(false);
      setActiveTab("editor");
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Resume AI Studio</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Anti-Fabrication Engine Active
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Merge live GitHub/LeetCode stats, match campus internship Job Descriptions, and generate tailored ATS resumes.
          </p>
        </div>

        {tailoredResume && (
          <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> Active Job Context: {tailoredResume.companyName} ({tailoredResume.jobTitle})
          </div>
        )}
      </div>

      {/* Workflow Navigation Bar */}
      <div className="glass rounded-2xl p-1.5 flex overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "upload"
              ? "btn-gradient shadow-md"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <Upload className="h-4 w-4" /> 1. Upload Base Resume
        </button>

        <button
          onClick={() => setActiveTab("profiles")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "profiles"
              ? "btn-gradient shadow-md"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <Link2 className="h-4 w-4" /> 2. Connected Profiles (GitHub/LeetCode)
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "jobs"
              ? "btn-gradient shadow-md"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" /> 3. Jobs Excel Directory
        </button>

        <button
          onClick={() => setActiveTab("editor")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "editor"
              ? "btn-gradient shadow-md"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <FileEdit className="h-4 w-4" /> 4. AI Tailored Resume Studio
        </button>
      </div>

      {/* Tab 1: Upload */}
      {activeTab === "upload" && (
        <ResumeUploadSection
          baseResume={baseResume}
          profile={profile}
          onUpdateResume={(res, prof) => {
            setBaseResume(res);
            setProfile(prof);
          }}
          onUpdateProfile={(updated) => setProfile(updated)}
        />
      )}

      {/* Tab 2: Connected Profiles */}
      {activeTab === "profiles" && (
        <ConnectedProfilesSection
          connected={connectedProfiles}
          onUpdateProfiles={(updated) => setConnectedProfiles(updated)}
        />
      )}

      {/* Tab 3: Jobs Excel Directory */}
      {activeTab === "jobs" && (
        <JobDirectorySection
          jobs={jobs}
          profile={profile}
          connected={connectedProfiles}
          onUpdateJobs={(updatedJobs) => setJobs(updatedJobs)}
          onSelectJobForAnalysis={(job) => setAnalyzingJob(job)}
          onSelectJobForTailoring={(job) => handleStartTailoring(job)}
        />
      )}

      {/* Tab 4: AI Resume Studio & Editor */}
      {activeTab === "editor" && (
        <ResumeEditorSection
          baseProfile={profile}
          tailoredResume={tailoredResume}
          connected={connectedProfiles}
          onUpdateTailoredResume={(updated) => setTailoredResume(updated)}
          onRestoreOriginal={() => setTailoredResume(null)}
        />
      )}

      {/* Job Analysis Modal */}
      {analyzingJob && (
        <JobAnalysisModal
          job={analyzingJob}
          profile={profile}
          connected={connectedProfiles}
          onClose={() => setAnalyzingJob(null)}
          onStartTailoring={() => {
            handleStartTailoring(analyzingJob);
            setAnalyzingJob(null);
          }}
        />
      )}

      {/* Loading Overlay during AI Tailoring */}
      {isTailoring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="glass rounded-3xl p-8 text-center space-y-4 max-w-sm">
            <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-brand mx-auto shadow-glow animate-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Analyzing Job Description...</h3>
            <p className="text-xs text-muted-foreground">
              Cross-referencing Candidate Profile, GitHub Repos & LeetCode stats against Job Requirements with strict anti-fabrication enforcement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
