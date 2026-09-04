import React, { useEffect, useState } from "react";
import { ResumeData } from "@/types/resume";
import { analyzeResumeATS, ATSAnalysisResult } from "@/lib/api/resume";
import { FileText, CheckCircle2, AlertCircle, Sparkles, BrainCircuit } from "lucide-react";

interface Props {
  data: ResumeData;
}

export const ATSFeedbackPanel: React.FC<Props> = ({ data }) => {
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    analyzeResumeATS(data).then((res) => {
      if (isMounted) setAnalysis(res);
    });
    return () => {
      isMounted = false;
    };
  }, [data]);

  if (!analysis) {
    return (
      <div className="rounded-2xl p-6 glass flex items-center justify-center text-xs text-muted-foreground gap-2">
        <Sparkles className="h-4 w-4 animate-pulse text-primary" /> Analyzing ATS performance...
      </div>
    );
  }

  const scorePercent = `${analysis.ats_score}%`;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Score Summary Card */}
      <div className="rounded-2xl p-6 glass flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
            <FileText className="h-4 w-4 text-primary" /> ATS Score Analysis
          </div>
          <div className="mt-3 flex items-end gap-2">
            <div className="text-5xl font-extrabold text-gradient">{analysis.ats_score}</div>
            <div className="mb-2 text-sm text-muted-foreground font-semibold">/ 100</div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full gradient-brand transition-all duration-500" style={{ width: scorePercent }} />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <BrainCircuit className="h-4 w-4 text-primary shrink-0" />
          <span>Calculated dynamically from your resume structure.</span>
        </div>
      </div>

      {/* Actionable Feedback Audit Checklist */}
      <div className="rounded-2xl p-6 glass space-y-3 lg:col-span-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Live ATS Audit & Recommendations
        </h3>
        <ul className="space-y-2 text-xs">
          {analysis.feedback.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              {item.type === "pass" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <span className={item.type === "pass" ? "text-foreground font-medium" : "text-muted-foreground"}>
                {item.message}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Keyword Suggestions Card */}
      <div className="rounded-2xl p-6 glass lg:col-span-2">
        <h3 className="font-semibold text-sm">Detected Keywords</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {analysis.keywords.length > 0 ? (
            analysis.keywords.map((k) => (
              <span key={k} className="rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-foreground">
                {k}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">Add skills or project details to view keyword metrics.</span>
          )}
        </div>
      </div>

      {/* Missing Skills Card */}
      <div className="rounded-2xl p-6 glass">
        <h3 className="font-semibold text-sm text-destructive flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" /> Missing Recommended Skills
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {analysis.missing_skills.length > 0 ? (
            analysis.missing_skills.map((k) => (
              <span key={k} className="rounded-full bg-destructive/10 border border-destructive/20 px-3 py-1 text-xs font-medium text-destructive">
                {k}
              </span>
            ))
          ) : (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> High skill coverage!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
