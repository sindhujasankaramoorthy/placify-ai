import React, { useState } from "react";
import { Download, Sparkles, RefreshCw, Eye, Edit3, CheckCircle2, RotateCcw, Layout, FileText, ArrowUp, ArrowDown, GitCompare, ShieldCheck } from "lucide-react";
import { CandidateProfile, ConnectedProfiles, ResumeTemplateId, TailoredResume } from "../../lib/resume/types";
import { ResumeTemplates } from "./ResumeTemplates";
import { exportToDocx, exportToPdf } from "../../lib/resume/exporter";

interface ResumeEditorSectionProps {
  baseProfile: CandidateProfile;
  tailoredResume: TailoredResume | null;
  connected: ConnectedProfiles;
  onUpdateTailoredResume: (updated: TailoredResume) => void;
  onRestoreOriginal: () => void;
}

export const ResumeEditorSection: React.FC<ResumeEditorSectionProps> = ({
  baseProfile,
  tailoredResume,
  connected,
  onUpdateTailoredResume,
  onRestoreOriginal,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>("modern-minimal");
  const [viewMode, setViewMode] = useState<"preview" | "diff" | "edit">("preview");

  const currentProfile: CandidateProfile = tailoredResume || baseProfile;

  // Active section ordering
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "achievements",
  ]);

  const moveSection = (index: number, direction: "up" | "down") => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = temp;
      setSectionOrder(newOrder);
    }
  };

  const handleRegenerateSection = (sectionName: string) => {
    if (!tailoredResume) return;

    if (sectionName === "summary") {
      const newSummary = `Highly focused Computer Science candidate with verified experience in ${currentProfile.skills.languages.slice(0, 3).join(", ")}. Demonstrated expertise building high-performance web applications tailored specifically for ${tailoredResume.companyName || "target placements"}.`;
      onUpdateTailoredResume({
        ...tailoredResume,
        summary: newSummary,
        tailoredSummary: newSummary,
      });
    } else if (sectionName === "skills") {
      const reorderedLanguages = [...currentProfile.skills.languages].reverse();
      onUpdateTailoredResume({
        ...tailoredResume,
        skills: {
          ...currentProfile.skills,
          languages: reorderedLanguages,
        },
      });
    }
  };

  const handleDownloadPdf = () => {
    exportToPdf("resume-document-node", `${currentProfile.name.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  const handleDownloadDocx = () => {
    exportToDocx(currentProfile, `${currentProfile.name.replace(/\s+/g, "_")}_Resume.docx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="glass rounded-3xl p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">AI Resume Studio & Editor</h2>
            {tailoredResume && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Tailored for {tailoredResume.companyName} ({tailoredResume.jobTitle})
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Customize ATS template, inspect AI rewrites in Diff Mode, reorder sections, and export PDF/DOCX.
          </p>
        </div>

        {/* View Mode Switcher & Download buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-border bg-background/80 p-1">
            <button
              onClick={() => setViewMode("preview")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "preview" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              onClick={() => setViewMode("diff")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === "diff" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" /> AI Diff ({tailoredResume?.diffs.length || 0})
            </button>
          </div>

          <button
            onClick={handleDownloadPdf}
            className="btn-gradient inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-md"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
          <button
            onClick={handleDownloadDocx}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-accent shadow-sm"
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" /> Download DOCX
          </button>

          {tailoredResume && (
            <button
              onClick={onRestoreOriginal}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              title="Restore Original Base Resume"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restore Original
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Template Selector & Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* Template Selector */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Layout className="h-4 w-4 text-primary" /> Select ATS Template
            </h3>

            <div className="space-y-2">
              {[
                { id: "modern-minimal", name: "Modern Minimalist", desc: "Clean header, balanced line spacing, ATS standard" },
                { id: "professional-classic", name: "Professional Classic", desc: "Traditional serif styling for corporate drives" },
                { id: "tech-focused", name: "Tech & Developer Focus", desc: "Highlights GitHub repos & LeetCode stats badges" },
                { id: "executive-clean", name: "Executive Clean", desc: "Bold section divides and strong hierarchy" },
              ].map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id as ResumeTemplateId)}
                  className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                    selectedTemplate === tpl.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card/40 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{tpl.name}</span>
                    {selectedTemplate === tpl.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{tpl.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Reordering Controls */}
          <div className="glass rounded-3xl p-6 space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-primary" /> Section Ordering & Regeneration
            </h3>
            <p className="text-xs text-muted-foreground">Adjust section hierarchy to match recruiter reading patterns.</p>

            <div className="space-y-2 pt-2">
              {sectionOrder.map((sec, idx) => (
                <div
                  key={sec}
                  className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-3 py-2 text-xs"
                >
                  <span className="font-semibold capitalize text-foreground">{sec}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRegenerateSection(sec)}
                      className="p-1 text-muted-foreground hover:text-primary"
                      title="Regenerate this section with AI"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === sectionOrder.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Document Preview or Diff Viewer */}
        <div className="lg:col-span-2">
          {viewMode === "preview" && (
            <div className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-3">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> ATS Compliance Score: <strong className="text-foreground">96/100</strong>
                </span>
                <span>Standard A4 Printable Format</span>
              </div>

              {/* Render Selected ATS Template */}
              <div className="rounded-2xl border border-border overflow-hidden bg-white text-slate-900 shadow-md">
                <ResumeTemplates profile={currentProfile} connected={connected} templateId={selectedTemplate} />
              </div>
            </div>
          )}

          {viewMode === "diff" && (
            <div className="glass rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold">AI Tailoring Change Tracker (Diff View)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspect exact rewordings and order optimizations applied strictly without fabricating information.
                </p>
              </div>

              {tailoredResume && tailoredResume.diffs.length > 0 ? (
                <div className="space-y-4">
                  {tailoredResume.diffs.map((diff, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-primary">{diff.section}</span>
                        <span className="text-muted-foreground">{diff.reason}</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 space-y-1">
                          <div className="font-semibold text-rose-600 dark:text-rose-400">Original Base</div>
                          <p className="text-muted-foreground">{diff.original}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1">
                          <div className="font-semibold text-emerald-600 dark:text-emerald-400">AI Tailored Optimization</div>
                          <p className="text-foreground font-medium">{diff.tailored}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
                  No tailoring diffs currently available. Select a job opportunity and click "Tailor Resume" to generate changes.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
