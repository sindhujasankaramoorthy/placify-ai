import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, DollarSign, Filter, Building2, Bookmark } from "lucide-react";

import { getDailyJobs } from "../lib/job-fetcher";

export const Route = createFileRoute("/dashboard/jobs")({
  head: () => ({
    meta: [
      { title: "Recommended Jobs — Placify AI" },
      { name: "description", content: "AI-matched job recommendations tailored to your profile." },
      { property: "og:title", content: "Recommended Jobs — Placify AI" },
      { property: "og:description", content: "Personalized job matches." },
    ],
  }),
  loader: async () => await getDailyJobs(),
  component: JobsPage,
});

function JobsPage() {
  const jobs = Route.useLoaderData();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recommended Jobs</h1>
        <p className="mt-1 text-muted-foreground">Personalized by your skills, projects and preferences.</p>
      </div>

      <div className="rounded-2xl p-4 glass">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search company, role, skill…" className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          {["Location", "Salary", "Skills", "Company", "Experience"].map((f) => (
            <button key={f} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm hover:bg-accent">
              <Filter className="h-3.5 w-3.5" /> {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs?.map((j, i) => (
          <div key={j.c + j.role + i} className="rounded-2xl p-6 glass transition-transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{j.c}</div>
                  <div className="text-base font-semibold">{j.role}</div>
                </div>
              </div>
              <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{j.match}% match</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.loc}</span>
              <span className="inline-flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {j.salary}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {j.skills.map((s) => (
                <span key={s} className="rounded-lg bg-accent px-2 py-0.5 text-xs text-accent-foreground">{s}</span>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-accent">View</button>
              <button className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold btn-gradient">Apply</button>
              <button className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-accent" aria-label="Save"><Bookmark className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
