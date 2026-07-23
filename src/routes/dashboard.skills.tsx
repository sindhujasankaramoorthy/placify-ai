import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/skills")({
  head: () => ({
    meta: [
      { title: "Skill Tracker — Placify AI" },
      { name: "description", content: "Track your skills and get an AI learning roadmap." },
      { property: "og:title", content: "Skill Tracker — Placify AI" },
      { property: "og:description", content: "Bridge your skill gaps." },
    ],
  }),
  component: SkillsPage,
});

const current = [
  { s: "React", v: 92 }, { s: "Node.js", v: 78 }, { s: "SQL", v: 85 }, { s: "Python", v: 70 },
];
const required = [
  { s: "System Design", v: 55 }, { s: "Kubernetes", v: 30 }, { s: "AWS", v: 45 },
];

function Ring({ v, label }: { v: number; label: string }) {
  const dash = 264;
  const off = dash - (dash * v) / 100;
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-28 w-28 place-items-center">
        <svg className="absolute inset-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="9" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gg)" strokeWidth="9"
            strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 50 50)" />
          <defs>
            <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.55 0.22 265)" />
              <stop offset="100%" stopColor="oklch(0.55 0.24 300)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-xl font-bold">{v}%</div>
      </div>
      <div className="mt-2 text-sm font-medium">{label}</div>
    </div>
  );
}

function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Gap Analysis</h1>
        <p className="mt-1 text-muted-foreground">See where you shine and what to learn next.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Current Skills</h3>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {current.map((s) => <Ring key={s.s} v={s.v} label={s.s} />)}
          </div>
        </div>
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Required for Target Roles</h3>
          <div className="mt-6 grid grid-cols-3 gap-6">
            {required.map((s) => <Ring key={s.s} v={s.v} label={s.s} />)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 glass">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">AI Suggestions</h3>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Focus 2 weeks on System Design to unlock 5+ SDE roles.</li>
          <li>• Take an AWS Cloud Practitioner cert — required by 40% of your matches.</li>
          <li>• Add 1 project featuring Kubernetes to boost resume score by ~6.</li>
        </ul>
      </div>

      <div className="rounded-2xl p-6 glass">
        <h3 className="font-semibold">Learning Roadmap</h3>
        <ol className="mt-4 space-y-3">
          {["System Design Basics", "Kubernetes 101", "AWS Fundamentals", "Advanced SQL"].map((step, i) => (
            <li key={step} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="grid h-8 w-8 place-items-center rounded-full gradient-brand text-sm font-bold text-white">{i + 1}</span>
              <div className="flex-1 text-sm font-medium">{step}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl p-6 glass">
        <h3 className="font-semibold">Recommended Courses</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { t: "Grokking System Design", by: "Educative" },
            { t: "Kubernetes for Devs", by: "Coursera" },
            { t: "AWS Practitioner", by: "AWS Training" },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-card p-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="mt-2 text-sm font-semibold">{c.t}</div>
              <div className="text-xs text-muted-foreground">{c.by}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
