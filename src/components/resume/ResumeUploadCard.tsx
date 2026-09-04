import React, { useState, useRef } from "react";
import { ResumeData } from "@/types/resume";
import { parseResumeFile } from "@/lib/api/resume";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  onParsedData: (data: ResumeData) => void;
}

export const ResumeUploadCard: React.FC<Props> = ({ onParsedData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const parsedData = await parseResumeFile(file);
      onParsedData(parsedData);
      setSuccessMessage(`Successfully extracted details from "${file.name}"! Form fields populated below.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse uploaded document. Please upload a valid PDF or DOCX file.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="rounded-2xl p-6 glass space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Auto-Fill from Existing Resume
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload your PDF or DOCX resume to automatically extract personal details, education, experience, and skills into the editor.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc"
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="btn-gradient text-xs font-semibold gap-2 whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Extracting Content...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload Resume (PDF / DOCX)
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
