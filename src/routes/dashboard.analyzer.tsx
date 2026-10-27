import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  FileText,
  Award,
  XCircle,
  ArrowRight,
  History,
  RotateCcw,
  UploadCloud,
  Layers,
  ChevronDown,
  ChevronUp,
  Clock,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchAtsPresets,
  executeAtsScan,
  fetchAtsHistory,
  ATSJobPreset,
  ATSScanResult,
  ATSHistoryItem,
  ATSApiError
} from "@/lib/api/ats";

export const Route = createFileRoute("/dashboard/analyzer")({
  head: () => ({
    meta: [
      { title: "AI ATS Resume Matcher — Placify AI" },
      { name: "description", content: "Compare your active resume against target Job Descriptions with deep ATS compliance scoring." },
    ],
  }),
  component: AnalyzerPage,
});

export default function AnalyzerPage() {
  const [presets, setPresets] = useState<ATSJobPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [scanStep, setScanStep] = useState("Running Deep ATS Scan...");
  const [activeResumeSource, setActiveResumeSource] = useState<any | null>(null);
  const [resumeError, setResumeError] = useState<{ message: string; link: string } | null>(null);

  // Scan result
  const [scanResult, setScanResult] = useState<ATSScanResult | null>(null);

  // History state
  const [history, setHistory] = useState<ATSHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load presets & active resume from localStorage on mount
  useEffect(() => {
    let isMounted = true;

    async function loadPresets() {
      try {
        const loadedPresets = await fetchAtsPresets();
        if (isMounted && loadedPresets.length > 0) {
          setPresets(loadedPresets);
        }
      } catch (err) {
        console.error("Failed to load ATS presets", err);
      }
    }

    loadPresets();

    // Check for active resume in localStorage
    if (typeof window !== "undefined") {
      try {
        const draft = localStorage.getItem("placify_resume_builder_draft");
        const profile = localStorage.getItem("placify_candidate_profile");
        const base = localStorage.getItem("placify_base_resume");

        if (draft) {
          setActiveResumeSource(JSON.parse(draft));
        } else if (profile) {
          setActiveResumeSource(JSON.parse(profile));
        } else if (base) {
          setActiveResumeSource(JSON.parse(base));
        }
      } catch (e) {
        console.error("Failed to parse local resume source", e);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Preset chip click -> fill textarea with realistic JD
  const loadPresetJD = (preset: ATSJobPreset) => {
    setSelectedPresetId(preset.id);
    setJdText(preset.description);
    setResumeError(null);
    toast.success(`Loaded preset for ${preset.company}!`);
  };

  // Run ATS Scan
  const runAnalysis = async () => {
    const trimmedJd = jdText.trim();

    if (!trimmedJd) {
      toast.error("Please paste or select a Job Description first!");
      return;
    }

    if (trimmedJd.length < 50) {
      toast.error(`Job Description is too short (${trimmedJd.length} chars). Please enter at least 50 characters.`);
      return;
    }

    if (trimmedJd.length > 8500) {
      toast.error(`Job Description exceeds 8,000 characters (${trimmedJd.length} chars). Please trim it.`);
      return;
    }

    setResumeError(null);
    setIsAnalyzing(true);
    setHasAnalyzed(false);

    // Multi-stage progression steps for responsive feedback
    const scanStages = [
      "Connecting to ATS Evaluation Engine...",
      "Extracting JD tech stack requisites & synonyms...",
      "Validating resume structural layout & formatting rules...",
      "Running Claude LLM semantic keyword density scan...",
      "Merging ATS scoring metrics & actionable suggestions..."
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx = (stageIdx + 1) % scanStages.length;
      setScanStep(scanStages[stageIdx]);
    }, 1200);

    try {
      // Refresh active resume from storage if available
      let resumeDataToPass = activeResumeSource;
      if (typeof window !== "undefined") {
        try {
          const draft = localStorage.getItem("placify_resume_builder_draft");
          const profile = localStorage.getItem("placify_candidate_profile");
          if (draft) resumeDataToPass = JSON.parse(draft);
          else if (profile) resumeDataToPass = JSON.parse(profile);
        } catch {
          // ignore
        }
      }

      const result = await executeAtsScan({
        jobDescription: trimmedJd,
        resumeData: resumeDataToPass,
      });

      clearInterval(interval);
      setScanResult(result);
      setHasAnalyzed(true);
      toast.success(`ATS Scan Complete — Verdict: ${result.verdict}!`);

      // Refresh history in background
      loadHistory();
    } catch (err: any) {
      clearInterval(interval);
      console.error("ATS Scan Error:", err);

      const apiErr = err as ATSApiError;
      if (apiErr.error === "NO_RESUME_FOUND") {
        setResumeError({
          message: apiErr.message || "Upload your resume first",
          link: apiErr.link || "/dashboard/resume",
        });
        toast.error("No resume found. Please upload or create your resume first.");
      } else if (apiErr.error === "RATE_LIMIT_EXCEEDED") {
        toast.warning(apiErr.message || "Rate limit of 10 scans/hour exceeded. Please try again later.");
      } else {
        toast.error(apiErr.message || "ATS scan encountered an unexpected error. Please try again.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScanAgain = () => {
    setHasAnalyzed(false);
    setScanResult(null);
    setResumeError(null);
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const items = await fetchAtsHistory();
      setHistory(items);
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const toggleHistory = () => {
    if (!showHistory && history.length === 0) {
      loadHistory();
    }
    setShowHistory(!showHistory);
  };

  const loadPastScan = (item: ATSHistoryItem) => {
    setJdText(item.jobDescription);
    setScanResult(item.result);
    setHasAnalyzed(true);
    toast.success(`Loaded scan from ${new Date(item.createdAt).toLocaleDateString()}`);
  };

  // Score colors calculation with increased thresholds
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: "#10b981", text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (score >= 60) return { stroke: "#f59e0b", text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    return { stroke: "#ef4444", text: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
  };

  const scoreTheme = scanResult ? getScoreColor(scanResult.overallScore) : getScoreColor(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI ATS Resume Matcher</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate your active resume formatting, structural score, and tech stack match against target Job Descriptions.
          </p>
        </div>

        <button
          onClick={toggleHistory}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-accent transition-colors self-start sm:self-auto cursor-pointer"
        >
          <History className="h-4 w-4 text-primary" />
          <span>Recent Scans ({history.length})</span>
          {showHistory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="rounded-3xl p-5 glass border border-border space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" /> Last 10 ATS Scans
            </h4>
            <span className="text-[11px] text-muted-foreground">Saved in SQLite database</span>
          </div>

          {isLoadingHistory ? (
            <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" /> Loading history...
            </div>
          ) : history.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">No scans recorded yet. Run your first deep ATS scan below!</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadPastScan(item)}
                  className="rounded-2xl border border-border bg-card/60 p-3.5 hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">Score: {item.result?.overallScore ?? 0}%</span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.jobDescription}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-primary pt-1 border-t border-border/50">
                    <span>{item.result?.verdict || "Match Audit"}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Load Report &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Two-Card Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Card: Input Job Description */}
        <div className="rounded-3xl p-6 glass border border-border flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Target Job Description
              </h3>
              <span className="text-xs text-muted-foreground">Plain text scan</span>
            </div>

            {/* Selector Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Job Presets:</span>
              {presets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => loadPresetJD(preset)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {preset.company} ({preset.role})
                  </button>
                );
              })}
            </div>

            <textarea
              rows={13}
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                setResumeError(null);
              }}
              className="w-full rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary outline-none"
              placeholder="Paste qualifications, desired tech stack list, or full job posting details here (minimum 50 characters)..."
            />

            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{jdText.length} characters</span>
              <span>Min: 50 · Max: 8,000</span>
            </div>

            {/* Error Banner if No Resume Exists */}
            {resumeError && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-destructive text-xs font-bold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Resume Required</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {resumeError.message}
                </p>
                <Link
                  to={resumeError.link as never}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mt-1"
                >
                  <UploadCloud className="h-3.5 w-3.5" /> Upload or create your resume on Resume page &rarr;
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="btn-gradient w-full rounded-xl py-3.5 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> {scanStep}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Run Deep ATS Scan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Card: Advanced AI Report */}
        <div className="rounded-3xl p-6 glass border border-border space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">ATS Compliance Report</h3>
            {hasAnalyzed && scanResult && (
              <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase ${scoreTheme.bg} ${scoreTheme.text} border ${scoreTheme.border}`}>
                {scanResult.verdict}
              </span>
            )}
          </div>

          {hasAnalyzed && scanResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score section */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative grid h-28 w-28 shrink-0 place-items-center mx-auto">
                  <svg className="absolute inset-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={scoreTheme.stroke}
                      strokeWidth="10"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * scanResult.overallScore) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className={`text-xl font-black ${scoreTheme.text}`}>{scanResult.overallScore}%</div>
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center justify-center sm:justify-start gap-1">
                    <Award className="h-3.5 w-3.5" /> Overall Match Index
                  </div>
                  <h4 className="text-base font-extrabold text-foreground">
                    {scanResult.overallScore >= 80
                      ? "Strong Candidate Match!"
                      : scanResult.overallScore >= 60
                      ? "Moderate Match Profile"
                      : "Refinement Strongly Advised"}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-normal max-w-sm">
                    {scanResult.overallScore >= 80
                      ? "Your resume shows high keyword density and structural alignment with this position."
                      : `Address ${scanResult.techStack.missing.length} missing technical keywords to increase compliance.`}
                  </p>
                </div>
              </div>

              {/* Sub-Score Bars */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-border">
                <div className="rounded-xl bg-card border border-border p-2.5 text-center">
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase block">Tech Stack Match</span>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">{scanResult.matchScore}%</p>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${scanResult.matchScore}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-card border border-border p-2.5 text-center">
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase block">Formatting</span>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">{scanResult.formattingScore}%</p>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${scanResult.formattingScore}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-card border border-border p-2.5 text-center">
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase block">Structure</span>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">{scanResult.structureScore}%</p>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${scanResult.structureScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Tech Stack Chips */}
              <div className="space-y-3.5 pt-2 border-t border-border">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Matched Skills ({scanResult.techStack.matched.length})
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {scanResult.techStack.matched.length > 0 ? (
                      scanResult.techStack.matched.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/15"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No required tech skills matched</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-rose-500" /> Missing Skills ({scanResult.techStack.missing.length})
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {scanResult.techStack.missing.length > 0 ? (
                      scanResult.techStack.missing.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/15"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-500 font-bold">🎉 Complete stack match! No missing skills.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sections Found vs Missing */}
              <div className="pt-2 border-t border-border">
                <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" /> Key Sections Analysis
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {scanResult.sectionsFound.map((sec) => (
                    <div key={sec} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">{sec}</span>
                    </div>
                  ))}
                  {scanResult.sectionsMissing.map((sec) => (
                    <div key={sec} className="flex items-center gap-1.5 text-amber-500">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span className="truncate">{sec} (Missing)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-border">
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-3.5 space-y-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Candidate Strengths</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                    {scanResult.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-3.5 space-y-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Weaknesses / Gaps</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                    {scanResult.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Suggestions */}
              <div className="rounded-2xl bg-card border border-border p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span>Actionable Improvement Plan</span>
                </div>
                <ul className="text-xs space-y-2 text-muted-foreground list-decimal list-inside leading-relaxed">
                  {scanResult.suggestions.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Scan Again Button */}
              <button
                onClick={handleScanAgain}
                className="w-full rounded-xl border border-border bg-card py-3 text-xs font-bold text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Scan Another Job Description
              </button>
            </div>
          ) : (
            <div className="h-[360px] rounded-3xl border border-dashed border-border/80 flex flex-col items-center justify-center text-center p-6 space-y-3 bg-card/20">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
                <Sparkles className="h-6 w-6 text-primary opacity-85 animate-float" />
              </div>
              <h4 className="font-bold text-foreground text-xs">AI Matcher Standby</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                Paste the desired qualifications or click a Preset Job Description in the left area, then click "Run Deep ATS Scan" to start analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
