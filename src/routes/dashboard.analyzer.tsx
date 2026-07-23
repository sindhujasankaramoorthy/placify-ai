import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/analyzer")({
  head: () => ({
    meta: [
      { title: "Resume Analyzer — Placify AI" },
      { name: "description", content: "Compare your resume with any job description." },
      { property: "og:title", content: "Resume Analyzer — Placify AI" },
      { property: "og:description", content: "Get a fit score for any role." },
    ],
  }),
  component: AnalyzerPage,
});

function AnalyzerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="mt-1 text-muted-foreground">Paste a job description and see how you stack up.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Job Description</h3>
          <textarea rows={12} className="mt-3 w-full rounded-xl border border-border bg-card p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Paste job description here…" />
          <button className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold btn-gradient">
            <Sparkles className="h-4 w-4" /> Analyze
          </button>
        </div>
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Fit Score</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative grid h-32 w-32 place-items-center">
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#g)" strokeWidth="10" strokeDasharray="264" strokeDashoffset="60" strokeLinecap="round" transform="rotate(-90 50 50)" />
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.22 265)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.24 300)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-2xl font-extrabold">78%</div>
            </div>
            <div className="text-sm text-muted-foreground">
              Good match. Add 2 missing keywords to reach 90+.
            </div>
          </div>
          <div className="mt-6">
            <div className="text-sm font-semibold">Matched keywords</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["React", "TypeScript", "Node", "REST"].map((k) => (
                <span key={k} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{k}</span>
              ))}
            </div>
            <div className="mt-4 text-sm font-semibold">Missing</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Kubernetes", "gRPC"].map((k) => (
                <span key={k} className="rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive">{k}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
