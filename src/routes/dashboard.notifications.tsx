import { createFileRoute } from "@tanstack/react-router";
import { Bell, Calendar, FileText, Briefcase } from "lucide-react";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Placify AI" },
      { name: "description", content: "Placement deadlines, interview alerts, resume updates." },
      { property: "og:title", content: "Notifications — Placify AI" },
      { property: "og:description", content: "Stay on top of your placement journey." },
    ],
  }),
  component: NotifPage,
});

const items = [
  { icon: Calendar, tone: "text-primary bg-primary/10", title: "Microsoft deadline in 3 days", when: "Nov 28" },
  { icon: Bell, tone: "text-amber-600 bg-amber-500/15", title: "Interview scheduled: Razorpay", when: "Tomorrow · 4 PM" },
  { icon: FileText, tone: "text-emerald-600 bg-emerald-500/15", title: "Resume score improved to 92", when: "Yesterday" },
  { icon: Briefcase, tone: "text-[oklch(0.55_0.24_300)] bg-brand-2/15", title: "5 new job matches added", when: "2 days ago" },
];

function NotifPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-1 text-muted-foreground">Everything happening on your placement journey.</p>
      </div>
      <div className="rounded-2xl p-2 glass">
        <ul className="divide-y divide-border">
          {items.map((n, i) => (
            <li key={i} className="flex items-center gap-4 p-4">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${n.tone}`}>
                <n.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.when}</div>
              </div>
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">View</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
