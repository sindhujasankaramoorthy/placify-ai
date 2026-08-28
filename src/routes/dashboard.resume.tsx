import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Link2, FileSpreadsheet, Sparkles, FileEdit, ShieldCheck } from "lucide-react";
import { BaseResume, CandidateProfile, ConnectedProfiles, JobOpportunity, TailoredResume } from "../lib/resume/types";
import { emptyCandidateProfile } from "../lib/resume/parser";
import { initialConnectedProfiles } from "../lib/resume/profileFetcher";
import { sampleJobsDataset } from "../lib/resume/excelParser";
import { generateTailoredResume } from "../lib/resume/tailorEngine";
import { ResumeUploadSection } from "../components/resume/ResumeUploadSection";
import { ConnectedProfilesSection } from "../components/resume/ConnectedProfilesSection";
import { JobDirectorySection } from "../components/resume/JobDirectorySection";
import { JobAnalysisModal } from "../components/resume/JobAnalysisModal";
import { ResumeEditorSection } from "../components/resume/ResumeEditorSection";
import { toast } from "sonner";

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

  // Base resume & candidate profile initialized as null unless saved in localStorage
  const [profile, setProfile] = useState<CandidateProfile | null>(() => {
    try {
      const saved = localStorage.getItem("placify_candidate_profile");
      if (!saved) return null;
      const parsed = JSON.parse(saved) as CandidateProfile;
      // Sanitize old corrupted artifacts
      if (
        parsed.phone === "20260228142543" ||
        parsed.location === "WqMQ,BAHClkJdv" ||
        parsed.experience?.[0]?.company === "Engineering R&D Tech" ||
        parsed.name?.endsWith("Resume")
      ) {
        localStorage.removeItem("placify_candidate_profile");
        localStorage.removeItem("placify_base_resume");
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [baseResume, setBaseResume] = useState<BaseResume | null>(() => {
    try {
      const savedProf = localStorage.getItem("placify_candidate_profile");
      if (!savedProf) return null;
      const saved = localStorage.getItem("placify_base_resume");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [connectedProfiles, setConnectedProfiles] = useState<ConnectedProfiles>(initialConnectedProfiles);
  const [jobs, setJobs] = useState<JobOpportunity[]>(sampleJobsDataset);

  const [analyzingJob, setAnalyzingJob] = useState<JobOpportunity | null>(null);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (baseResume) {
        localStorage.setItem("placify_base_resume", JSON.stringify(baseResume));
      } else {
        localStorage.removeItem("placify_base_resume");
      }
    } catch (e) {
      console.error(e);
    }
  }, [baseResume]);

  useEffect(() => {
    try {
      if (profile) {
        localStorage.setItem("placify_candidate_profile", JSON.stringify(profile));
      } else {
        localStorage.removeItem("placify_candidate_profile");
      }
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  const handleUpdateResume = async (res: BaseResume, prof: CandidateProfile) => {
    setBaseResume(res);
    setProfile(prof);

    try {
      let updatedConnected = { ...connectedProfiles };
      if (prof.githubUrl) {
        const ghUsername = prof.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, "").replace(/\/$/, "").trim();
        if (ghUsername) {
          const liveGh = await fetchGitHubProfile(ghUsername);
          updatedConnected = { ...updatedConnected, github: liveGh };
        }
      }
      if (prof.linkedinUrl) {
        const liveLi = await fetchLinkedInProfile(prof.linkedinUrl);
        updatedConnected = { ...updatedConnected, linkedin: liveLi };
      }
      setConnectedProfiles(updatedConnected);
    } catch (err) {
      console.error("Auto profile sync error:", err);
    }
  };

  const handleUpdateProfile = (prof: CandidateProfile) => {
    setProfile(prof);
  };

  const handleRemoveResume = () => {
    setBaseResume(null);
    setProfile(null);
    setTailoredResume(null);
    setConnectedProfiles(initialConnectedProfiles);
  };

  // Trigger AI Tailoring Engine
  const handleStartTailoring = (job: JobOpportunity) => {
    if (!profile || !profile.name) {
      toast.error("Please upload your base resume in Step 1 first before generating tailored resumes!");
      setActiveTab("upload");
      return;
    }

    setIsTailoring(true);
    setTimeout(() => {
      const result = generateTailoredResume(profile, connectedProfiles, job);
      setTailoredResume(result);
      setIsTailoring(false);
      setActiveTab("editor");
      toast.success(`Generated tailored resume for ${job.company} (${job.role})!`);
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
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "upload"
              ? "btn-gradient shadow-md text-white"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <Upload className="h-4 w-4" /> 1. Upload Base Resume
        </button>

        <button
          onClick={() => setActiveTab("profiles")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "profiles"
              ? "btn-gradient shadow-md text-white"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <Link2 className="h-4 w-4" /> 2. Connected Profiles (GitHub/LeetCode)
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "jobs"
              ? "btn-gradient shadow-md text-white"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" /> 3. Jobs Excel Directory
        </button>

        <button
          onClick={() => setActiveTab("editor")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "editor"
              ? "btn-gradient shadow-md text-white"
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
          onUpdateResume={handleUpdateResume}
          onUpdateProfile={handleUpdateProfile}
          onRemoveResume={handleRemoveResume}
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
          profile={profile || emptyCandidateProfile}
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
          onNavigateToUpload={() => setActiveTab("upload")}
        />
      )}

      {/* Job Analysis Modal */}
      {analyzingJob && (
        <JobAnalysisModal
          job={analyzingJob}
          profile={profile || emptyCandidateProfile}
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
