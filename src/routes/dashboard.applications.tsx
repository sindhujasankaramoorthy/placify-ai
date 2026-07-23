import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/applications")({
  head: () => ({
    meta: [
      { title: "Applications — Placify AI" },
      { name: "description", content: "Kanban board to track every application." },
      { property: "og:title", content: "Applications — Placify AI" },
      { property: "og:description", content: "Track applications across stages." },
    ],
  }),
  component: AppsPage,
});

type Card = { c: string; role: string; deadline?: string; interview?: string };
const columns: { title: string; tone: string; cards: Card[] }[] = [
  { title: "Applied", tone: "bg-primary/10 text-primary", cards: [
    { c: "Google", role: "SDE Intern", deadline: "Nov 28" },
    { c: "Amazon", role: "SDE-1", deadline: "Dec 02" },
  ]},
  { title: "Shortlisted", tone: "bg-brand-2/15 text-[oklch(0.55_0.24_300)]", cards: [
    { c: "Razorpay", role: "Backend", interview: "Nov 26" },
  ]},
  { title: "Interview", tone: "bg-amber-500/15 text-amber-600", cards: [
    { c: "Microsoft", role: "SWE", interview: "Nov 25 · 3PM" },
    { c: "Flipkart", role: "APM", interview: "Nov 30" },
  ]},
  { title: "Selected", tone: "bg-emerald-500/15 text-emerald-600", cards: [
    { c: "Zoho", role: "SDE Trainee" },
  ]},
  { title: "Rejected", tone: "bg-destructive/10 text-destructive", cards: [
    { c: "Meta", role: "SWE Intern" },
  ]},
];

function AppsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Application Tracker</h1>
        <p className="mt-1 text-muted-foreground">Drag-style kanban of your placement pipeline.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {columns.map((col) => (
          <div key={col.title} className="rounded-2xl p-4 glass">
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${col.tone}`}>
                {col.title}
              </div>
              <span className="text-xs text-muted-foreground">{col.cards.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {col.cards.map((c) => (
                <div key={c.c + c.role} className="rounded-xl border border-border bg-card p-3">
                  <div className="text-sm font-semibold">{c.c}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                  {c.deadline && <div className="mt-2 text-xs">Deadline: <span className="font-medium">{c.deadline}</span></div>}
                  {c.interview && <div className="mt-2 text-xs">Interview: <span className="font-medium">{c.interview}</span></div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
