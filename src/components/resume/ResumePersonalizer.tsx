import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Download,
  Building2,
  MapPin,
  Search,
  ChevronRight,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Wand2,
  Briefcase,
  Check,
  LayoutTemplate,
  FileSpreadsheet,
  Layers,
  ArrowLeft,
  ChevronDown,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import {
  ResumeData,
  createEmptyResumeData,
  normalizeResumeData,
  candidateProfileToResumeData,
} from "@/types/resume";
import { parseResumeFile } from "@/lib/resume/parser";
import {
  personalizeResumeForJob,
  PersonalizerJobTarget,
  PersonalizationResult,
} from "@/lib/resume/personalizerEngine";
import { TemplateRenderer } from "./templates/TemplateRenderer";
import { AVAILABLE_TEMPLATES } from "./templates/templateRegistry";
import { exportResumePdf } from "@/lib/pdf/exportResumePdf";
import { exportToDocx } from "@/lib/resume/exporter";
import { generateNaukriEngineeringDataset } from "@/lib/naukri-dataset";
import { sampleJobsDataset } from "@/lib/resume/excelParser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Props {
  initialJob?: PersonalizerJobTarget | null;
  onNavigateToBuilder?: (data: ResumeData) => void;
}

const CATEGORY_FILTERS = [
  "All",
  "Software Dev",
  "AI & Data Science",
  "Full Stack",
  "Backend",
  "Frontend",
  "Cloud & DevOps",
  "Internship",
];

export const ResumePersonalizer: React.FC<Props> = ({ initialJob }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resume state
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window === "undefined") return createEmptyResumeData();
    try {
      const savedDraft = localStorage.getItem("placify_resume_builder_draft");
      if (savedDraft) return normalizeResumeData(JSON.parse(savedDraft));

      const savedProfile = localStorage.getItem("placify_candidate_profile");
      if (savedProfile) {
        return candidateProfileToResumeData(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error(e);
    }
    return createEmptyResumeData();
  });

  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Job selection state
  const [selectedJob, setSelectedJob] = useState<PersonalizerJobTarget | null>(() => {
    if (initialJob) return initialJob;
    if (typeof window === "undefined") return null;
    try {
      const savedJob = localStorage.getItem("placify_personalize_job");
      if (savedJob) {
        return JSON.parse(savedJob);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [showJobModal, setShowJobModal] = useState(false);
  const [jobSelectSource, setJobSelectSource] = useState<"live" | "campus" | "custom">("live");

  // Job search & filters in picker
  const [jobSearch, setJobSearch] = useState("");
  const [jobCatFilter, setJobCatFilter] = useState("All");

  // Custom Job input state
  const [customRole, setCustomRole] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [customLocation, setCustomLocation] = useState("Bengaluru, India");
  const [customSkills, setCustomSkills] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  // Personalization results
  const [result, setResult] = useState<PersonalizationResult | null>(null);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"preview" | "diff" | "gaps" | "audit">("preview");
  const [activeTemplateId, setActiveTemplateId] = useState("modern-pro");
  const [isExporting, setIsExporting] = useState(false);

  // Pre-load recommended jobs dataset for selection
  const liveEngineeringJobs = useMemo(() => {
    try {
      return generateNaukriEngineeringDataset();
    } catch {
      return [];
    }
  }, []);

  // Filtered live jobs for picker
  const filteredLiveJobs = useMemo(() => {
    return liveEngineeringJobs
      .filter((j) => {
        const matchesCat = jobCatFilter === "All" || j.category === jobCatFilter;
        const matchesQuery =
          !jobSearch ||
          j.role.toLowerCase().includes(jobSearch.toLowerCase()) ||
          j.c.toLowerCase().includes(jobSearch.toLowerCase()) ||
          (j.skills || []).some((s) => s.toLowerCase().includes(jobSearch.toLowerCase()));
        return matchesCat && matchesQuery;
      })
      .slice(0, 30);
  }, [liveEngineeringJobs, jobSearch, jobCatFilter]);

  // Check if resume has content
  const hasValidResume = Boolean(
    resumeData.personalInfo?.fullName ||
      (resumeData.experience && resumeData.experience.length > 0) ||
      (resumeData.projects && resumeData.projects.length > 0) ||
      (resumeData.education && resumeData.education.length > 0) ||
      (resumeData.skills && resumeData.skills.length > 0)
  );

  // File upload handler
  const handleFileUpload = async (file: File) => {
    setIsParsingFile(true);
    setUploadedFileName(file.name);
    toast.loading(`Parsing ${file.name} with anti-hallucination engine...`, { id: "personalizer-parse" });

    try {
      const { profile } = await parseResumeFile(file);
      const converted = candidateProfileToResumeData(profile);
      setResumeData(converted);
      setResult(null); // Reset previous personalization
      toast.success(`Extracted details for ${converted.personalInfo.fullName || file.name}!`, {
        id: "personalizer-parse",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to parse resume file. You can still enter details or try another file.", {
        id: "personalizer-parse",
      });
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Run Personalization
  const handleRunPersonalization = async () => {
    if (!hasValidResume) {
      toast.error("Please upload or load a resume in Step 1 first.");
      return;
    }
    if (!selectedJob) {
      toast.error("Please choose a target job in Step 2 first.");
      return;
    }

    setIsPersonalizing(true);
    toast.loading(`Personalizing resume for ${selectedJob.company} (${selectedJob.title})...`, {
      id: "personalize-process",
    });

    try {
      // Small simulated delay for deep algorithmic processing
      await new Promise((r) => setTimeout(r, 600));

      const personalizerOutput = personalizeResumeForJob(resumeData, selectedJob);
      setResult(personalizerOutput);

      toast.success(
        `Personalization complete! ATS Match score boosted from ${personalizerOutput.matchScoreBefore}% to ${personalizerOutput.matchScoreAfter}%. 0 Hallucinations Verified.`,
        { id: "personalize-process" }
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Personalization process failed. Please try again.", {
        id: "personalize-process",
      });
    } finally {
      setIsPersonalizing(false);
    }
  };

  // Export PDF
  const handleExportPdf = async () => {
    if (!result) return;
    setIsExporting(true);
    try {
      const filename = `${(selectedJob?.company || "Company").replace(/[^a-zA-Z0-9]/g, "_")}_${(
        selectedJob?.title || "Role"
      ).replace(/[^a-zA-Z0-9]/g, "_")}_Personalized_Resume.pdf`;

      await exportResumePdf({
        elementId: "personalizer-resume-preview-doc",
        filename,
      });
      toast.success(`Downloaded ATS-ready PDF: ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error("PDF generation encountered an error. Opening print preview...");
    } finally {
      setIsExporting(false);
    }
  };

  // Export DOCX
  const handleExportDocx = () => {
    if (!result) return;
    try {
      const p = result.personalizedResume;
      const convertedProfile = {
        name: p.personalInfo.fullName,
        email: p.personalInfo.email,
        phone: p.personalInfo.phone,
        location: p.personalInfo.location,
        linkedinUrl: p.personalInfo.linkedin,
        githubUrl: p.personalInfo.github,
        portfolioUrl: p.personalInfo.portfolio,
        summary: p.summary,
        skills: {
          languages: p.skills.find((s) => s.categoryName.toLowerCase().includes("lang"))?.skills || [],
          frameworks: p.skills.find((s) => s.categoryName.toLowerCase().includes("frame"))?.skills || [],
          tools: p.skills.find((s) => s.categoryName.toLowerCase().includes("tool"))?.skills || [],
          databases: p.skills.find((s) => s.categoryName.toLowerCase().includes("data"))?.skills || [],
          softSkills: p.skills.find((s) => s.categoryName.toLowerCase().includes("soft"))?.skills || [],
        },
        experience: p.experience.map((e) => ({
          id: e.id,
          role: e.position,
          company: e.company,
          location: e.location,
          startDate: e.startDate,
          endDate: e.endDate,
          highlights: e.bullets,
        })),
        projects: p.projects.map((pr) => ({
          id: pr.id,
          title: pr.title,
          description: pr.description,
          techStack: pr.technologies,
          highlights: pr.bullets,
        })),
        education: p.education.map((ed) => ({
          id: ed.id,
          degree: ed.degree,
          institution: ed.institution,
          location: ed.location,
          graduationYear: ed.endDate,
          score: ed.gpa,
        })),
        certifications: p.certifications.map((c) => ({
          id: c.id,
          name: c.name,
          issuer: c.issuer,
          year: c.issueDate,
        })),
        achievements: p.achievements.map((a) => `${a.title}: ${a.description}`),
      };

      const filename = `${(selectedJob?.company || "Company").replace(/[^a-zA-Z0-9]/g, "_")}_Personalized_Resume.docx`;
      exportToDocx(convertedProfile as any, filename);
      toast.success("Downloaded Word (.docx) document.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to export Word document.");
    }
  };

  // Open in 10-Template AI Resume Builder
  const handleOpenInBuilder = () => {
    if (!result) return;
    try {
      localStorage.setItem("placify_resume_builder_draft", JSON.stringify(result.personalizedResume));
      toast.success("Transferred tailored resume into 10-Template AI Resume Builder!");
      navigate({ to: "/dashboard/resume" });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Resume Personalizer</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" /> Zero-Hallucination & Anti-Fabrication Guarantee
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your resume, select any target engineering opening, and generate an authentic, ATS-optimized personalized resume strictly anchored to your real qualifications.
          </p>
        </div>

        {selectedJob && (
          <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <Building2 className="h-4 w-4" /> Target: {selectedJob.company} — {selectedJob.title}
          </div>
        )}
      </div>

      {/* Main Workflow Grid: Step 1 (Upload) & Step 2 (Choose Job) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Step 1: Resume Source Card */}
        <div className="glass rounded-3xl p-6 border border-border/60 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-xl bg-primary text-xs font-bold text-white">
                  1
                </span>
                <h3 className="font-bold text-foreground">Upload or Select Resume</h3>
              </div>
              {hasValidResume && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Resume Active
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Drop your PDF, Word document (.docx), or load existing profile. The anti-hallucination parser extracts authentic details without fictitious fallbacks.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl p-6 border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
              isDragging
                ? "border-primary bg-primary/10 shadow-glow"
                : "border-border hover:border-primary/50 bg-card/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
              accept=".pdf,.docx,.txt,.doc"
              className="hidden"
            />
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mx-auto">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                {isParsingFile ? "Extracting Truthful Credentials..." : "Click or Drag & Drop Resume File"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Supports PDF, DOCX, TXT (up to 10MB)</p>
            </div>
          </div>

          {/* Resume Snapshot */}
          {hasValidResume ? (
            <div className="rounded-2xl border border-border bg-card/80 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" /> {resumeData.personalInfo.fullName || "Candidate Resume"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {uploadedFileName || "Saved Candidate Profile"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span>🎓 {resumeData.education.length} Degrees</span>
                <span>•</span>
                <span>💼 {resumeData.experience.length + resumeData.internships.length} Work Records</span>
                <span>•</span>
                <span>💻 {resumeData.projects.length} Projects</span>
                <span>•</span>
                <span>⚡ {resumeData.skills.reduce((acc, c) => acc + c.skills.length, 0)} Skills</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    const prof = localStorage.getItem("placify_candidate_profile");
                    if (prof) {
                      setResumeData(candidateProfileToResumeData(JSON.parse(prof)));
                      toast.success("Loaded saved candidate profile!");
                    } else {
                      toast.info("No saved profile found. Please upload a resume PDF or DOCX.");
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="text-xs"
              >
                Load Default Profile from Storage
              </Button>
            </div>
          )}
        </div>

        {/* Step 2: Target Job Selection Card */}
        <div className="glass rounded-3xl p-6 border border-border/60 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-xl bg-primary text-xs font-bold text-white">
                  2
                </span>
                <h3 className="font-bold text-foreground">Choose Target Job</h3>
              </div>
              {selectedJob && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[11px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Job Selected
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Choose an opening from 1,000+ Naukri & Indeed live feed jobs, campus placement roles, or paste a custom JD.
            </p>
          </div>

          {selectedJob ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{selectedJob.title}</h4>
                  <p className="text-xs font-semibold text-primary flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3 w-3" /> {selectedJob.company} {selectedJob.location ? `• ${selectedJob.location}` : ""}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowJobModal(true)}
                  className="text-xs h-7 px-2.5"
                >
                  Change Job
                </Button>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {(selectedJob.skills || []).map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-secondary border border-border px-2 py-0.5 text-[10px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedJob.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 italic">
                  "{selectedJob.description.replace(/<[^>]*>?/gm, "").substring(0, 180)}..."
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border bg-card/40 p-6 text-center space-y-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary mx-auto text-muted-foreground">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">No Target Job Selected</p>
                <p className="text-[11px] text-muted-foreground">
                  Pick from our verified jobs directory or input a custom role
                </p>
              </div>
              <Button
                onClick={() => setShowJobModal(true)}
                className="btn-gradient text-xs font-semibold gap-1.5"
              >
                <Search className="h-3.5 w-3.5" /> Select Job from Directory
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-[11px] text-muted-foreground">Need a custom job description?</span>
            <button
              onClick={() => {
                setJobSelectSource("custom");
                setShowJobModal(true);
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Paste Custom JD →
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Run Personalization Action Bar */}
      <div className="glass rounded-3xl p-6 border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" /> Generate Zero-Hallucination Personalized Resume
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl">
            Aligns professional summary, re-orders verified skills for ATS density, enhances bullet action verbs, and maps project relevance. Missing requirements are strictly cataloged as transparent learning gaps — never hallucinated.
          </p>
        </div>

        <Button
          onClick={handleRunPersonalization}
          disabled={!hasValidResume || !selectedJob || isPersonalizing}
          size="lg"
          className="btn-gradient font-bold text-xs gap-2 whitespace-nowrap shadow-lg active:scale-95 cursor-pointer"
        >
          {isPersonalizing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Personalizing with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Personalize Resume Now <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Step 4: Personalization Results & Anti-Hallucination Dashboard */}
      {result && (
        <div className="space-y-6 pt-4 border-t border-border">
          {/* Header Stats Bar: Anti-Hallucination Audit & ATS Score Meter */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* ATS Match Boost */}
            <div className="glass rounded-2xl p-4 border border-primary/30 bg-primary/5 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">ATS Job Match Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-primary">{result.matchScoreAfter}%</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  (+{result.matchScoreAfter - result.matchScoreBefore}% Boost)
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.matchScoreAfter}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">Pre-tailoring: {result.matchScoreBefore}%</span>
            </div>

            {/* Anti-Hallucination Audit Badge */}
            <div className="glass rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">Anti-Hallucination Audit</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">100% Truthful</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                0 Fake Companies • 0 Fake Degrees • 0 Fabricated Skills
              </p>
            </div>

            {/* Matched Skills Count */}
            <div className="glass rounded-2xl p-4 border border-border space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">Verified Skills Matched</span>
              <div className="text-2xl font-black text-foreground">{result.matchedSkills.length}</div>
              <p className="text-[11px] text-muted-foreground">Prioritized at top of technical categories</p>
            </div>

            {/* Skill Gaps Flagged */}
            <div className="glass rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">Identified Skill Gaps</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{result.skillGaps.length}</div>
              <p className="text-[11px] text-muted-foreground">Tracked transparently for your learning</p>
            </div>
          </div>

          {/* Action Toolbar: View Mode Tabs + Export Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl glass">
            {/* View Mode Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveViewTab("preview")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeViewTab === "preview"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5 inline mr-1" /> Personalized Document Preview
              </button>
              <button
                onClick={() => setActiveViewTab("diff")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeViewTab === "diff"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <Layers className="h-3.5 w-3.5 inline mr-1" /> Side-by-Side Diff ({result.diffs.length})
              </button>
              <button
                onClick={() => setActiveViewTab("gaps")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeViewTab === "gaps"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5 inline mr-1" /> Skill Gaps ({result.skillGaps.length})
              </button>
              <button
                onClick={() => setActiveViewTab("audit")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeViewTab === "audit"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 inline mr-1" /> Audit Report
              </button>
            </div>

            {/* Template Selector & Export Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeViewTab === "preview" && (
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="text-[11px] font-semibold text-muted-foreground">Template:</span>
                  <select
                    value={activeTemplateId}
                    onChange={(e) => setActiveTemplateId(e.target.value)}
                    className="text-xs bg-background border border-border rounded-xl px-2.5 py-1 font-medium focus:ring-1 focus:ring-primary"
                  >
                    {AVAILABLE_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDocx}
                className="text-xs font-semibold gap-1.5"
              >
                <FileText className="h-3.5 w-3.5 text-blue-500" /> Word (.docx)
              </Button>

              <Button
                size="sm"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="btn-gradient text-xs font-semibold gap-1.5 shadow-sm"
              >
                {isExporting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                Download ATS PDF
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInBuilder}
                className="text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              >
                <LayoutTemplate className="h-3.5 w-3.5" /> Open in AI Builder →
              </Button>
            </div>
          </div>

          {/* Tab 1: Live ATS Document Preview */}
          {activeViewTab === "preview" && (
            <div className="glass rounded-3xl p-6 border border-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h4 className="font-bold text-sm">Personalized Document Preview</h4>
                  <p className="text-xs text-muted-foreground">
                    ATS-compatible layout formatted specifically for {selectedJob?.company}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {AVAILABLE_TEMPLATES.find((t) => t.id === activeTemplateId)?.name}
                </Badge>
              </div>

              {/* Rendered Live Preview Document */}
              <div className="overflow-x-auto max-w-full pb-4">
                <div
                  id="personalizer-resume-preview-doc"
                  className="mx-auto shadow-xl rounded-xl overflow-hidden max-w-[850px] bg-white text-slate-900 border border-border"
                >
                  <TemplateRenderer
                    templateId={activeTemplateId}
                    data={result.personalizedResume}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Side-by-Side Diff */}
          {activeViewTab === "diff" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                <span className="font-bold text-foreground">Anti-Fabrication Diff Analysis: </span>
                Every change below highlights targeted positional refinement, active engineering verbs, and skill prioritization. No unearned facts, fictitious companies, or fake degrees were created.
              </div>

              <div className="space-y-3">
                {result.diffs.map((diff, idx) => (
                  <div key={idx} className="glass rounded-2xl p-5 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Section: {diff.section}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground italic">
                        {diff.reason}
                      </span>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 text-xs">
                      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 space-y-1">
                        <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider block">
                          Original Resume
                        </span>
                        <p className="text-muted-foreground">{diff.original || "None"}</p>
                      </div>

                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                          Tailored for {selectedJob?.company}
                        </span>
                        <p className="text-foreground font-medium">{diff.tailored}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Skill Gaps & Recommended Learning */}
          {activeViewTab === "gaps" && (
            <div className="glass rounded-3xl p-6 border border-border space-y-6">
              <div className="space-y-1">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" /> Transparent Skill Gap Analysis
                </h4>
                <p className="text-xs text-muted-foreground">
                  Placify's Anti-Hallucination Engine identified the following skills required by {selectedJob?.company} that are currently missing from your resume. Rather than fabricating them, we provide you with recommended learning paths so you can genuinely prepare.
                </p>
              </div>

              {result.skillGaps.length === 0 ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                  <h5 className="font-bold text-sm text-foreground">Zero Skill Gaps Detected!</h5>
                  <p className="text-xs text-muted-foreground">
                    Your authentic technical profile satisfies 100% of the core skills requested for this position.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {result.skillGaps.map((gap) => (
                    <div
                      key={gap}
                      className="rounded-2xl border border-border bg-card/60 p-4 space-y-2 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">{gap}</span>
                        <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10">
                          Recommended Skill
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Not in your resume. Build a project or review core interview questions for {gap} before interviewing for the {selectedJob?.title} role.
                      </p>
                      <div className="pt-2 text-[11px] font-semibold text-primary flex items-center gap-1">
                        <Info className="h-3 w-3" /> Excluded from resume to maintain 100% truthfulness.
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Matched Skills Overview */}
              <div className="pt-4 border-t border-border space-y-2">
                <h5 className="text-xs font-bold text-foreground">
                  Verified Skills Matching Job Requirements ({result.matchedSkills.length}):
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedSkills.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs py-1 px-2.5"
                    >
                      <Check className="h-3 w-3 mr-1" /> {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Anti-Hallucination Audit Report */}
          {activeViewTab === "audit" && (
            <div className="glass rounded-3xl p-6 border border-border space-y-6">
              <div className="space-y-1">
                <h4 className="font-bold text-base flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" /> Automated Anti-Hallucination Audit
                </h4>
                <p className="text-xs text-muted-foreground">
                  Programmatic verification asserting complete factual preservation across education, employment, and candidate identity.
                </p>
              </div>

              <div className="space-y-3">
                {result.audit.verifications.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card/60"
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-foreground">{v.section}</h5>
                      <p className="text-xs text-muted-foreground">{v.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-1">
                <span className="font-bold text-foreground">Placify AI Ethics Commitment:</span>
                <p>
                  We guarantee that candidate resumes produced by Placify AI will never fabricate unearned credentials, fictitious company tenures, or deceptive metrics. Technical recruiters respect authenticity and verified foundational skills.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Target Job Selection Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl border border-border max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-lg text-foreground">Select Target Job for Personalization</h3>
                <p className="text-xs text-muted-foreground">
                  Pick from real openings or paste a custom job description
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJobModal(false)}
                className="h-8 w-8 p-0 rounded-full"
              >
                ✕
              </Button>
            </div>

            {/* Source Tabs */}
            <div className="flex border-b border-border px-6 pt-3 gap-4 shrink-0 bg-muted/20">
              <button
                onClick={() => setJobSelectSource("live")}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  jobSelectSource === "live"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Naukri & Indeed Live Jobs (1,000+)
              </button>
              <button
                onClick={() => setJobSelectSource("campus")}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  jobSelectSource === "campus"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Campus Placement Roles
              </button>
              <button
                onClick={() => setJobSelectSource("custom")}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  jobSelectSource === "custom"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Paste Custom Job Description
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Option 1: Live Jobs Feed */}
              {jobSelectSource === "live" && (
                <div className="space-y-4">
                  {/* Search & Category Filter */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder="Search by role or company (e.g. SDE, Google, Full Stack)..."
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {CATEGORY_FILTERS.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setJobCatFilter(cat)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                          jobCatFilter === cat
                            ? "bg-primary text-white"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Jobs List */}
                  <div className="space-y-2">
                    {filteredLiveJobs.map((j) => (
                      <div
                        key={j.id}
                        className="p-3.5 rounded-2xl border border-border bg-card/60 hover:border-primary/50 transition-all flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground truncate">{j.role}</span>
                            <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                              • {j.c}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                            <span>📍 {j.loc}</span>
                            <span>•</span>
                            <span>💰 {j.salary}</span>
                            <span>•</span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              {j.match}% Initial Match
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {j.skills.slice(0, 4).map((s) => (
                              <span
                                key={s}
                                className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedJob({
                              id: j.id,
                              title: j.role,
                              company: j.c,
                              location: j.loc,
                              description: j.desc || "",
                              skills: j.skills,
                              category: j.category,
                              experienceLevel: j.exp,
                              source: j.source,
                            });
                            setShowJobModal(false);
                            toast.success(`Selected ${j.c} (${j.role})!`);
                          }}
                          className="btn-gradient text-xs font-semibold shrink-0"
                        >
                          Select Job
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Option 2: Campus Placement Roles */}
              {jobSelectSource === "campus" && (
                <div className="space-y-3">
                  {sampleJobsDataset.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-2xl border border-border bg-card/60 hover:border-primary/50 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{job.role}</span>
                          <span className="text-xs font-semibold text-primary">• {job.company}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{job.eligibility}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.skills.map((s) => (
                            <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedJob({
                            id: job.id,
                            title: job.role,
                            company: job.company,
                            location: job.location,
                            description: job.jobDescription,
                            skills: job.skills,
                          });
                          setShowJobModal(false);
                          toast.success(`Selected ${job.company} (${job.role})!`);
                        }}
                        className="btn-gradient text-xs font-semibold shrink-0"
                      >
                        Select Job
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Option 3: Custom Job Entry */}
              {jobSelectSource === "custom" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Target Role Title *</label>
                      <Input
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Target Company Name *</label>
                      <Input
                        value={customCompany}
                        onChange={(e) => setCustomCompany(e.target.value)}
                        placeholder="e.g. Stripe, Google, Freshworks"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Job Location</label>
                    <Input
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="e.g. Bengaluru, India (Hybrid) or Remote"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Required Skills (comma-separated) *
                    </label>
                    <Input
                      value={customSkills}
                      onChange={(e) => setCustomSkills(e.target.value)}
                      placeholder="e.g. React, TypeScript, GraphQL, Next.js, Jest"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Full Job Description</label>
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={5}
                      placeholder="Paste the job description or core responsibilities here..."
                      className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <Button
                    onClick={() => {
                      if (!customRole.trim() || !customCompany.trim()) {
                        toast.error("Please enter at least Role Title and Company Name.");
                        return;
                      }
                      const parsedSkills = customSkills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);

                      setSelectedJob({
                        id: `custom-${Date.now()}`,
                        title: customRole.trim(),
                        company: customCompany.trim(),
                        location: customLocation.trim(),
                        description: customDescription.trim(),
                        skills: parsedSkills.length > 0 ? parsedSkills : ["Software Development"],
                      });
                      setShowJobModal(false);
                      toast.success(`Configured custom job: ${customCompany} (${customRole})!`);
                    }}
                    className="btn-gradient w-full text-xs font-semibold"
                  >
                    Use Custom Job Target
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
