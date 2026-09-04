import React, { useState } from "react";
import { ResumeData, createEmptyResumeData, normalizeResumeData } from "@/types/resume";
import { ResumeEditor } from "./ResumeEditor";
import { ResumePreview } from "./ResumePreview";
import { TemplateSelector } from "./TemplateSelector";
import { ResumeListDialog } from "./ResumeListDialog";
import { ResumeUploadCard } from "./ResumeUploadCard";
import { AITailorCard } from "./AITailorCard";
import { ATSFeedbackPanel } from "./ATSFeedbackPanel";
import { createResume, updateResume, ApiResumeResponse } from "@/lib/api/resume";
import { exportResumePdf } from "@/lib/pdf/exportResumePdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RotateCcw, Edit3, Eye, Save, Check, Loader2, AlertCircle, Download } from "lucide-react";

export const ResumeBuilderContainer: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(createEmptyResumeData);
  const [templateId, setTemplateId] = useState<string>("modern");
  const [resumeTitle, setResumeTitle] = useState<string>("Untitled Resume");
  const [currentResumeId, setCurrentResumeId] = useState<number | string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

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
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const cleanName = resumeTitle ? `${resumeTitle.replace(/[^a-z0-9 ]/gi, "_")}.pdf` : "Resume.pdf";
      await exportResumePdf({
        filename: cleanName,
        elementId: "resume-preview-document",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Could not generate PDF. Please ensure your resume preview is visible and try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSelectResume = (savedResume: ApiResumeResponse) => {
    setCurrentResumeId(savedResume.id);
    setResumeTitle(savedResume.title || "Untitled Resume");
    setTemplateId(savedResume.template_id || "modern");
    setResumeData(normalizeResumeData(savedResume.content));
    setSaveStatus("idle");
  };

  const handleCreateNew = () => {
    setCurrentResumeId(null);
    setResumeTitle("My New Resume");
    setResumeData(createEmptyResumeData());
    setSaveStatus("idle");
  };

  const handleParsedData = (parsedData: ResumeData) => {
    const cleanData = normalizeResumeData(parsedData);
    setResumeData(cleanData);
    if (cleanData.personalInfo.fullName) {
      setResumeTitle(`${cleanData.personalInfo.fullName} Resume`);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all resume fields?")) {
      setResumeData(createEmptyResumeData());
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls & Resume Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-5">
        <div className="space-y-1.5 flex-1 max-w-md">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Resume Title
          </label>
          <Input
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            placeholder="e.g. Software Engineer Resume 2026"
            className="font-bold text-base bg-card/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Saved Resumes List Modal */}
          <ResumeListDialog
            currentResumeId={currentResumeId}
            onSelectResume={handleSelectResume}
            onCreateNew={handleCreateNew}
          />

          {/* Template Selector Modal */}
          <TemplateSelector selectedTemplateId={templateId} onSelectTemplate={setTemplateId} />

          {/* Save / Update Button */}
          <Button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="btn-gradient text-xs font-semibold gap-1.5 min-w-[110px]"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" /> Saved!
              </>
            ) : saveStatus === "error" ? (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-rose-300" /> Error Saving
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> {currentResumeId ? "Update Resume" : "Save Resume"}
              </>
            )}
          </Button>

          {/* Download PDF Button */}
          <Button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-sm"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Download PDF
              </>
            )}
          </Button>

          {/* Clear Form Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs font-semibold hover:bg-destructive/10 hover:text-destructive border-border"
            title="Clear Form"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Auto-Fill PDF / DOCX Resume Upload Dropzone Card */}
      <ResumeUploadCard onParsedData={handleParsedData} />

      {/* AI Resume Tailoring for Target Job Role */}
      <AITailorCard data={resumeData} onTailoredData={handleParsedData} />

      {/* Dynamic ATS Score & Keyword Analysis Panel */}
      <ATSFeedbackPanel data={resumeData} />

      {/* Desktop Layout: Split View */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 items-start">
        <div className="lg:col-span-6 space-y-6">
          <ResumeEditor data={resumeData} onChange={setResumeData} />
        </div>
        <div className="lg:col-span-6 sticky top-6 h-[calc(100vh-4rem)]">
          <ResumePreview data={resumeData} templateId={templateId} />
        </div>
      </div>

      {/* Mobile / Tablet Layout: Tabbed Switcher */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "edit" | "preview")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-card/80 border border-border p-1 rounded-xl">
            <TabsTrigger value="edit" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
              <Edit3 className="h-4 w-4" /> Edit Resume
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2 text-xs font-semibold rounded-lg">
              <Eye className="h-4 w-4" /> Live Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-0">
            <ResumeEditor data={resumeData} onChange={setResumeData} />
          </TabsContent>
          <TabsContent value="preview" className="mt-0">
            <ResumePreview data={resumeData} templateId={templateId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
