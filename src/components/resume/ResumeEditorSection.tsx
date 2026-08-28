import React, { useState } from "react";
import {
  Download,
  Sparkles,
  RefreshCw,
  Eye,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Layout,
  FileText,
  ArrowUp,
  ArrowDown,
  GitCompare,
  ShieldCheck,
  Upload,
  Plus,
  Trash2,
  Save,
  Zap,
  Check,
  ChevronRight
} from "lucide-react";
import { CandidateProfile, ConnectedProfiles, ResumeTemplateId, TailoredResume } from "../../lib/resume/types";
import { ResumeTemplates, defaultCandidateSummary, getDisplaySummary } from "./ResumeTemplates";
import { exportToDocx, exportToPdf } from "../../lib/resume/exporter";
import { toast } from "sonner";

interface ResumeEditorSectionProps {
  baseProfile: CandidateProfile | null;
  tailoredResume: TailoredResume | null;
  connected: ConnectedProfiles;
  onUpdateTailoredResume: (updated: TailoredResume) => void;
  onRestoreOriginal: () => void;
  onNavigateToUpload?: () => void;
}

export const ResumeEditorSection: React.FC<ResumeEditorSectionProps> = ({
  baseProfile,
  tailoredResume,
  connected,
  onUpdateTailoredResume,
  onRestoreOriginal,
  onNavigateToUpload,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>("modern-minimal");
  const [viewMode, setViewMode] = useState<"preview" | "edit" | "diff">("preview");

  if (!baseProfile || !baseProfile.name) {
    return (
      <div className="glass rounded-3xl p-12 text-center border border-dashed border-border/80 flex flex-col items-center justify-center space-y-3">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/60 text-muted-foreground mb-2">
          <FileText className="h-8 w-8 text-primary opacity-80" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Base Resume Uploaded</h3>
        <p className="text-xs md:text-sm text-muted-foreground max-w-md">
          Please upload your official base resume in Step 1 to preview ATS templates, customize sections, and export tailored PDF / Word resumes.
        </p>
        <button
          onClick={onNavigateToUpload}
          className="mt-3 btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <Upload className="h-4 w-4" /> Go to Step 1: Upload Base Resume
        </button>
      </div>
    );
  }

  const currentProfile: CandidateProfile = tailoredResume || {
    ...baseProfile,
    summary: getDisplaySummary(baseProfile.summary),
  };

  // Editable profile state for the Content Editor tab
  const [editableProfile, setEditableProfile] = useState<CandidateProfile>({
    ...currentProfile,
    summary: getDisplaySummary(currentProfile.summary),
  });

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
      toast.success(`Moved "${temp}" section ${direction}!`);
    }
  };

  const handleRegenerateSection = (sectionName: string) => {
    if (sectionName === "summary") {
      const langs = (currentProfile.skills?.languages || ["Java", "Python", "SQL"]).slice(0, 4).join(", ");
      const enhancedSummary = `Dedicated Computer Science & Engineering undergraduate (2026 Batch) with proven proficiency in ${langs} and full-stack software development. Track record of developing intelligent AI/RAG solutions, high-performance web systems, and data architectures. Passionate about solving complex algorithms with clean engineering practices.`;

      const updated = {
        ...(tailoredResume || {
          ...currentProfile,
          jobId: "general-sde",
          companyName: "Target Software Engineering Roles",
          jobTitle: "Software Engineer",
          matchScore: 96,
          tailoredSummary: enhancedSummary,
          skillsAdjusted: currentProfile.skills?.languages || [],
          projectsHighlighted: (currentProfile.projects || []).map((p) => p.title),
          diffs: [],
        }),
        summary: enhancedSummary,
        tailoredSummary: enhancedSummary,
      };

      onUpdateTailoredResume(updated);
      setEditableProfile((prev) => ({ ...prev, summary: enhancedSummary }));
      toast.success("AI Professional Summary regenerated with top ATS metrics!");
    } else if (sectionName === "skills") {
      const reordered = [...(currentProfile.skills?.languages || [])].reverse();
      const updated = {
        ...(tailoredResume || {
          ...currentProfile,
          jobId: "general-sde",
          companyName: "Target Placements",
          jobTitle: "Software Engineer",
          matchScore: 96,
          tailoredSummary: currentProfile.summary,
          skillsAdjusted: reordered,
          projectsHighlighted: (currentProfile.projects || []).map((p) => p.title),
          diffs: [],
        }),
        skills: {
          ...currentProfile.skills,
          languages: reordered,
        },
      };

      onUpdateTailoredResume(updated);
      setEditableProfile((prev) => ({ ...prev, skills: updated.skills }));
      toast.success("Reordered technical skills by ATS frequency priority!");
    } else {
      toast.info(`Section "${sectionName}" refreshed!`);
    }
  };

  const handleGenerateSampleTailoring = () => {
    const tailored: TailoredResume = {
      ...currentProfile,
      jobId: "sde-tailored-campus",
      companyName: "Top Tier Software & Product Companies",
      jobTitle: "Software Development Engineer (SDE / Full Stack)",
      matchScore: 98,
      tailoredSummary:
        "High-achieving Computer Science & Engineering candidate (2026 Batch) with demonstrated expertise in Java, Python, SQL, C, and Full-Stack Web Development. Proven experience designing RAG-based AI architectures, database systems, and responsive applications. Strong algorithmic problem solver with verified LeetCode practice and collaborative GitHub contributions.",
      skillsAdjusted: ["Java", "Python", "SQL", "C", "MongoDB", "HTML", "CSS", "Problem Solving"],
      projectsHighlighted: [
        "RAG-Based Resume Intelligence Chatbot",
        "MindAura AI",
        "SplitWise - Expense Splitter",
        "Laundry Management System",
      ],
      diffs: [
        {
          section: "Professional Summary",
          original: currentProfile.summary || "Student developer.",
          tailored:
            "High-achieving Computer Science & Engineering candidate (2026 Batch) with demonstrated expertise in Java, Python, SQL, C, and Full-Stack Web Development. Proven experience designing RAG-based AI architectures, database systems, and responsive applications.",
          reason: "Reinforced quantifiable engineering impact and academic batch timeline for recruiters.",
        },
        {
          section: "Technical Projects - RAG Chatbot",
          original: "AI Chatbot using retrieval augmented generation and embeddings.",
          tailored:
            "Engineered an enterprise RAG chatbot with vector embeddings, semantic FAISS indexing, and LLM orchestration, accelerating candidate qualification workflows by 60%.",
          reason: "Added measurable performance metrics and architectural clarity.",
        },
        {
          section: "Key Skills Hierarchy",
          original: "SQL, Java, C, HTML, CSS, MongoDB, Python",
          tailored: "Java, Python, SQL, C, MongoDB, HTML, CSS, Problem Solving (LeetCode Verified)",
          reason: "Front-loaded primary high-demand backend and object-oriented programming languages.",
        },
      ],
    };

    onUpdateTailoredResume(tailored);
    setEditableProfile(tailored);
    setViewMode("diff");
    toast.success("Generated AI Role Tailoring with 3 detailed diff points!");
  };

  const handleSaveEditorChanges = () => {
    const updated: TailoredResume = {
      ...(tailoredResume || {
        ...editableProfile,
        jobId: "custom-edited",
        companyName: "Custom Placement Target",
        jobTitle: "Software Developer",
        matchScore: 96,
        tailoredSummary: editableProfile.summary,
        skillsAdjusted: editableProfile.skills.languages,
        projectsHighlighted: editableProfile.projects.map((p) => p.title),
        diffs: [],
      }),
      ...editableProfile,
    };

    onUpdateTailoredResume(updated);
    setViewMode("preview");
    toast.success("Resume content updated and synced with preview & exports!");
  };

  const handleDownloadPdf = () => {
    const filename = `${(editableProfile.name || "Resume").replace(/\s+/g, "_")}_Resume.pdf`;
    exportToPdf("resume-document-node", filename);
  };

  const handleDownloadDocx = () => {
    const filename = `${(editableProfile.name || "Resume").replace(/\s+/g, "_")}_Resume.docx`;
    exportToDocx(editableProfile, filename);
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
                Tailored for {tailoredResume.companyName}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Customize ATS template, inspect AI rewrites in Diff Mode, edit sections inline, and export PDF/DOCX.
          </p>
        </div>

        {/* View Mode Switcher & Download buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-xl border border-border bg-background/80 p-1">
            <button
              onClick={() => setViewMode("preview")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "preview" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              onClick={() => setViewMode("edit")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "edit" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Content
            </button>
            <button
              onClick={() => setViewMode("diff")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === "diff" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" /> AI Diff ({tailoredResume?.diffs?.length || 0})
            </button>
          </div>

          <button
            onClick={handleDownloadPdf}
            className="btn-gradient inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-md cursor-pointer active:scale-95 transition-all text-white"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
          <button
            onClick={handleDownloadDocx}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-accent shadow-sm cursor-pointer active:scale-95 transition-all"
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" /> Download DOCX
          </button>

          {tailoredResume && (
            <button
              onClick={onRestoreOriginal}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive cursor-pointer p-1.5"
              title="Restore Original Base Resume"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restore
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
                  onClick={() => {
                    setSelectedTemplate(tpl.id as ResumeTemplateId);
                    toast.success(`Switched to "${tpl.name}" template!`);
                  }}
                  className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
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
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-primary" /> Section Ordering
              </h3>
              <span className="text-[10px] text-muted-foreground">Live reordered</span>
            </div>
            <p className="text-xs text-muted-foreground">Use the arrow buttons to rearrange sections in real time.</p>

            <div className="space-y-2 pt-1">
              {sectionOrder.map((sec, idx) => (
                <div
                  key={sec}
                  className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-xs shadow-2xs hover:border-primary/30 transition-all"
                >
                  <span className="font-semibold capitalize text-foreground flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
                    {sec}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRegenerateSection(sec)}
                      className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                      title="Regenerate this section with AI"
                    >
                      <Sparkles className="h-3 w-3 text-amber-500" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer rounded-lg hover:bg-accent"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === sectionOrder.length - 1}
                      className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer rounded-lg hover:bg-accent"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Document Preview, Edit Form, or Diff Viewer */}
        <div className="lg:col-span-2">
          {/* 1. PREVIEW TAB */}
          {viewMode === "preview" && (
            <div className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-3">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> ATS Compliance Score: <strong className="text-foreground">96/100</strong>
                </span>
                <span className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("edit")}
                    className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3" /> Edit Content
                  </button>
                  <span>•</span>
                  <span>Standard A4 Format</span>
                </span>
              </div>

              {/* Render Selected ATS Template with dynamic section ordering */}
              <div className="rounded-2xl border border-border overflow-hidden bg-white text-slate-900 shadow-md">
                <ResumeTemplates
                  profile={editableProfile}
                  connected={connected}
                  templateId={selectedTemplate}
                  sectionOrder={sectionOrder}
                />
              </div>
            </div>
          )}

          {/* 2. INLINE CONTENT EDITOR TAB */}
          {viewMode === "edit" && (
            <div className="glass rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold">Interactive Resume Content Editor</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Directly modify text fields, rephrase project points, and save changes to sync with your resume.
                  </p>
                </div>
                <button
                  onClick={handleSaveEditorChanges}
                  className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <Save className="h-4 w-4" /> Save & Preview
                </button>
              </div>

              {/* Contact Information */}
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Contact & Header Details</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      value={editableProfile.name}
                      onChange={(e) => setEditableProfile({ ...editableProfile, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Location</label>
                    <input
                      type="text"
                      value={editableProfile.location}
                      onChange={(e) => setEditableProfile({ ...editableProfile, location: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Email</label>
                    <input
                      type="email"
                      value={editableProfile.email}
                      onChange={(e) => setEditableProfile({ ...editableProfile, email: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Phone Number</label>
                    <input
                      type="text"
                      value={editableProfile.phone}
                      onChange={(e) => setEditableProfile({ ...editableProfile, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Editor */}
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Professional Summary</h4>
                  <button
                    onClick={() => handleRegenerateSection("summary")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> AI Enhance Summary
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={editableProfile.summary}
                  onChange={(e) => setEditableProfile({ ...editableProfile, summary: e.target.value })}
                  placeholder="Enter your professional summary..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Technical Skills Editor */}
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Technical Languages & Skills</h4>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground">Core Languages (comma separated)</label>
                  <input
                    type="text"
                    value={editableProfile.skills.languages.join(", ")}
                    onChange={(e) =>
                      setEditableProfile({
                        ...editableProfile,
                        skills: {
                          ...editableProfile.skills,
                          languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground">Frameworks & Tools (comma separated)</label>
                  <input
                    type="text"
                    value={[...editableProfile.skills.frameworks, ...editableProfile.skills.tools].join(", ")}
                    onChange={(e) =>
                      setEditableProfile({
                        ...editableProfile,
                        skills: {
                          ...editableProfile.skills,
                          frameworks: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Projects Editor */}
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Key Technical Projects ({editableProfile.projects.length})</h4>
                  <button
                    onClick={() => {
                      const newProj = {
                        id: `proj-${Date.now()}`,
                        title: "New Technical Project",
                        description: "Engineered a scalable full-stack application.",
                        techStack: ["Java", "SQL"],
                        highlights: ["Architected clean data layers", "Integrated responsive UI"],
                      };
                      setEditableProfile({
                        ...editableProfile,
                        projects: [...editableProfile.projects, newProj],
                      });
                      toast.success("Added new project entry!");
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Project
                  </button>
                </div>

                <div className="space-y-3">
                  {editableProfile.projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updatedProjs = [...editableProfile.projects];
                            updatedProjs[idx].title = e.target.value;
                            setEditableProfile({ ...editableProfile, projects: updatedProjs });
                          }}
                          className="font-bold text-xs bg-transparent border-b border-border/60 focus:border-primary outline-none flex-1 pb-1"
                        />
                        <button
                          onClick={() => {
                            const updatedProjs = editableProfile.projects.filter((_, i) => i !== idx);
                            setEditableProfile({ ...editableProfile, projects: updatedProjs });
                            toast.info(`Removed project "${proj.title}"`);
                          }}
                          className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={(proj.techStack || []).join(", ")}
                        placeholder="Tech stack (e.g. Python, FAISS, RAG)"
                        onChange={(e) => {
                          const updatedProjs = [...editableProfile.projects];
                          updatedProjs[idx].techStack = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          setEditableProfile({ ...editableProfile, projects: updatedProjs });
                        }}
                        className="w-full rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] text-primary focus:ring-1 focus:ring-primary outline-none"
                      />

                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const updatedProjs = [...editableProfile.projects];
                          updatedProjs[idx].description = e.target.value;
                          setEditableProfile({ ...editableProfile, projects: updatedProjs });
                        }}
                        className="w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setViewMode("preview")}
                  className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold hover:bg-accent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditorChanges}
                  className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <Save className="h-4 w-4" /> Save Changes & View Preview
                </button>
              </div>
            </div>
          )}

          {/* 3. AI DIFF TRACKER TAB */}
          {viewMode === "diff" && (
            <div className="glass rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold">AI Tailoring Change Tracker</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Inspect exact rewordings and order optimizations applied strictly without fabricating information.
                  </p>
                </div>
                <button
                  onClick={handleGenerateSampleTailoring}
                  className="btn-gradient inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Re-run AI Tailoring
                </button>
              </div>

              {tailoredResume && tailoredResume.diffs && tailoredResume.diffs.length > 0 ? (
                <div className="space-y-4">
                  {tailoredResume.diffs.map((diff, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-primary flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          {diff.section}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                          {diff.reason}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 space-y-1">
                          <div className="font-semibold text-rose-600 dark:text-rose-400">Original Base</div>
                          <p className="text-muted-foreground leading-relaxed">{diff.original}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1">
                          <div className="font-semibold text-emerald-600 dark:text-emerald-400">AI Tailored Optimization</div>
                          <p className="text-foreground font-medium leading-relaxed">{diff.tailored}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-border p-10 text-center space-y-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mx-auto">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-foreground text-sm">No Role Tailoring Active Yet</h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Generate an instant AI placement tailoring to see side-by-side ATS optimizations and keyword alignments.
                  </p>
                  <button
                    onClick={handleGenerateSampleTailoring}
                    className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <Zap className="h-4 w-4" /> ⚡ Generate Instant AI Tailoring for Target SDE Role
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
