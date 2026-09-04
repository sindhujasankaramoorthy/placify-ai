import React, { useState, useEffect } from "react";
import {
  ResumeData,
  createEmptyResumeData,
  normalizeResumeData,
  candidateProfileToResumeData,
  resumeDataToCandidateProfile,
} from "@/types/resume";
import { ResumeEditor } from "./ResumeEditor";
import { ResumePreview } from "./ResumePreview";
import { TemplateSelector } from "./TemplateSelector";
import { ResumeListDialog } from "./ResumeListDialog";
import { ResumeUploadCard } from "./ResumeUploadCard";
import { AITailorCard } from "./AITailorCard";
import { ATSFeedbackPanel } from "./ATSFeedbackPanel";
import {
  createResume,
  updateResume,
  ApiResumeResponse,
} from "@/lib/api/resume";
import { exportResumePdf } from "@/lib/pdf/exportResumePdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RotateCcw,
  Edit3,
  Eye,
  Save,
  Check,
  Loader2,
  AlertCircle,
  Download,
  Share2,
  Sparkles,
  ArrowDownToLine,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialData?: ResumeData;
  onSyncToProfile?: (data: ResumeData) => void;
}

export const ResumeBuilderContainer: React.FC<Props> = ({
  initialData,
  onSyncToProfile,
}) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (initialData) return normalizeResumeData(initialData);

    if (typeof window === "undefined") return createEmptyResumeData();

    // Try reading active draft from localStorage
    try {
      const savedDraft = localStorage.getItem("placify_resume_builder_draft");
      if (savedDraft) {
        return normalizeResumeData(JSON.parse(savedDraft));
      }

      // Try importing from base candidateProfile if available
      const existingProfile = localStorage.getItem("placify_candidate_profile");
      if (existingProfile) {
        const parsed = JSON.parse(existingProfile);
        return candidateProfileToResumeData(parsed);
      }
    } catch (e) {
      console.error("Failed to load initial draft", e);
    }
    return createEmptyResumeData();
  });

  const [templateId, setTemplateId] = useState<string>("modern-pro");
  const [resumeTitle, setResumeTitle] = useState<string>("Professional Resume");
  const [currentResumeId, setCurrentResumeId] = useState<number | string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");

  // Keep local draft synchronized in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("placify_resume_builder_draft", JSON.stringify(resumeData));
    } catch (e) {
      // ignore quota errors
    }
  }, [resumeData]);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      if (currentResumeId) {
        await updateResume(currentResumeId, {
          title: resumeTitle,
          template_id: templateId,
          content: resumeData,
        });
        setSaveStatus("saved");
      } else {
        const created = await createResume({
          title: resumeTitle,
          template_id: templateId,
          content: resumeData,
        });
        setCurrentResumeId(created.id);
        setSaveStatus("saved");
      }

      toast.success(`"${resumeTitle}" has been saved successfully to your repository.`);

      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      toast.error("Could not save resume draft. Please try again.");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const cleanName = resumeTitle
        ? `${resumeTitle.replace(/[^a-z0-9 ]/gi, "_").trim()}.pdf`
        : "Placify_Resume.pdf";

      await exportResumePdf({
        filename: cleanName,
        elementId: "resume-preview-document",
      });

      toast.success(`Exported "${cleanName}" with high-resolution ATS layout.`);
    } catch (err: any) {
      console.error("PDF Export Error:", err);
      toast.info("Opening browser high-fidelity print dialog for PDF generation.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSelectResume = (selected: ApiResumeResponse) => {
    setCurrentResumeId(selected.id);
    setResumeTitle(selected.title || "Untitled Resume");
    if (selected.template_id) {
      setTemplateId(selected.template_id);
    }
    if (selected.content) {
      setResumeData(normalizeResumeData(selected.content));
    }
    toast.success(`Opened "${selected.title || "Untitled Resume"}".`);
  };

  const handleCreateNew = () => {
    if (window.confirm("Create a new blank resume? Make sure you have saved your current draft.")) {
      setCurrentResumeId(null);
      setResumeTitle("Untitled Resume");
      setResumeData(createEmptyResumeData());
      toast.success("Created a blank resume canvas.");
    }
  };

  const handleImportFromProfile = () => {
    try {
      if (typeof window === "undefined") return;
      const existingProfile = localStorage.getItem("placify_candidate_profile");
      if (!existingProfile) {
        toast.error("Upload a base resume or connect GitHub/LeetCode in the candidate profile first.");
        return;
      }
      const parsed = JSON.parse(existingProfile);
      const converted = candidateProfileToResumeData(parsed);
      setResumeData(converted);
      toast.success("Successfully imported your Placify candidate profile into the builder.");
    } catch (err) {
      console.error(err);
      toast.error("Could not read candidate profile from storage.");
    }
  };

  const handlePushToProfile = () => {
    try {
      if (typeof window === "undefined") return;
      const candidateProfile = resumeDataToCandidateProfile(resumeData);
      localStorage.setItem("placify_candidate_profile", JSON.stringify(candidateProfile));
      if (onSyncToProfile) {
        onSyncToProfile(resumeData);
      }
      toast.success("Your base Placify profile & anti-fabrication match data have been updated.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="rounded-2xl p-4 glass flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border">
        {/* Title Input */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Input
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className="text-sm font-bold bg-background/70 border-border h-9"
            placeholder="Resume Document Title..."
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <TemplateSelector
            selectedTemplateId={templateId}
            onSelectTemplate={setTemplateId}
          />

          <ResumeListDialog
            currentResumeId={currentResumeId}
            onSelectResume={handleSelectResume}
            onCreateNew={handleCreateNew}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleImportFromProfile}
            title="Import all data from your Placify Candidate Profile"
            className="text-xs gap-1.5 h-9 bg-card hover:bg-accent border-border"
          >
            <ArrowDownToLine className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Import Profile</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePushToProfile}
            title="Sync this resume back to your main candidate profile & job matching"
            className="text-xs gap-1.5 h-9 bg-card hover:bg-accent border-border"
          >
            <RefreshCw className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Sync to Jobs</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="text-xs gap-1.5 h-9 font-semibold bg-card hover:bg-accent border-border"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Saved!
              </>
            ) : saveStatus === "error" ? (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-destructive" /> Retry
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 text-primary" /> Save
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="btn-gradient text-xs gap-1.5 h-9 font-semibold shadow-sm"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Exporting...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Assistance Row: Parser Auto-Fill & Role Tailoring */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ResumeUploadCard onParsedData={(parsed) => setResumeData(normalizeResumeData(parsed))} />
        <AITailorCard
          data={resumeData}
          onTailoredData={(tailored) => setResumeData(normalizeResumeData(tailored))}
        />
      </div>

      {/* View Switcher for Compact / Mobile Screens */}
      <div className="flex items-center justify-between xl:hidden">
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as any)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-2 w-full sm:w-60">
            <TabsTrigger value="edit" className="gap-1.5 text-xs">
              <Edit3 className="h-3.5 w-3.5" /> Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1.5 text-xs">
              <Eye className="h-3.5 w-3.5" /> Live Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Studio Grid: Left Editor & Right Live Document Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Editor Column */}
        <div
          className={`xl:col-span-6 space-y-4 ${
            viewMode === "preview" ? "hidden xl:block" : "block"
          }`}
        >
          <ResumeEditor data={resumeData} onChange={setResumeData} />
        </div>

        {/* Live Preview Column */}
        <div
          className={`xl:col-span-6 xl:sticky xl:top-6 ${
            viewMode === "edit" ? "hidden xl:block" : "block"
          }`}
        >
          <ResumePreview data={resumeData} templateId={templateId} />
        </div>
      </div>

      {/* Real-Time ATS Audit & Recommendations Panel */}
      <div className="pt-2">
        <ATSFeedbackPanel data={resumeData} />
      </div>
    </div>
  );
};
