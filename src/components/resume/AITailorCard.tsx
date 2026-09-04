import React, { useState } from "react";
import { ResumeData } from "@/types/resume";
import { generateAITailoredResume } from "@/lib/api/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Wand2, Loader2, Target, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  data: ResumeData;
  onTailoredData: (tailoredData: ResumeData) => void;
}

const POPULAR_ROLES = [
  "Cloud Engineer",
  "Full Stack Developer",
  "Backend Engineer",
  "Frontend Developer",
  "DevOps Engineer",
  "Data Scientist",
];

export const AITailorCard: React.FC<Props> = ({ data, onTailoredData }) => {
  const [targetRole, setTargetRole] = useState<string>("Cloud Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError("Please select or enter a target job role.");
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const result = await generateAITailoredResume(data, targetRole.trim());
      onTailoredData(result.tailored_content);
      setSuccessMsg(`Resume successfully tailored for "${targetRole.trim()}"! Updated content & ATS score reflected below.`);
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "AI Resume Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 glass space-y-4 border border-primary/20 bg-card/60">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
            <Wand2 className="h-4 w-4 text-primary" /> AI Resume Tailoring for Target Role
          </h3>
          <p className="text-xs text-muted-foreground">
            Select your target job role. AI will optimize phrasing, bullet verbs, and skill grouping without inventing false data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="btn-gradient text-xs font-semibold gap-2 whitespace-nowrap shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Tailoring with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate AI-Tailored Resume
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Target Role Input & Pills */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Target className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Cloud Engineer"
              className="pl-9 text-xs font-medium bg-background/80"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">Popular Roles:</span>
            {POPULAR_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  targetRole.toLowerCase() === role.toLowerCase()
                    ? "gradient-brand text-white shadow-sm"
                    : "bg-card border border-border hover:bg-accent text-muted-foreground"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};
