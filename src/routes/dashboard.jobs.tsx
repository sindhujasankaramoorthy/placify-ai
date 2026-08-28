import * as React from "react";
import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, DollarSign, Filter, Building2, Bookmark, ChevronDown, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

import { getDailyJobs } from "../lib/job-fetcher";

interface JobInfo {
  c: string; // company
  role: string;
  loc: string;
  salary: string;
  match: number;
  skills: string[];
  url?: string;
  desc?: string;
}

export const Route = createFileRoute("/dashboard/jobs")({
  head: () => ({
    meta: [
      { title: "Recommended Jobs — Placify AI" },
      { name: "description", content: "AI-matched job recommendations tailored to your profile." },
      { property: "og:title", content: "Recommended Jobs — Placify AI" },
      { property: "og:description", content: "Personalized job matches." },
    ],
  }),
  loader: async () => await getDailyJobs() as JobInfo[],
  component: JobsPage,
});

function JobsPage() {
  const jobs = Route.useLoaderData() || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoc, setSelectedLoc] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedExp, setSelectedExp] = useState("All");
  const [selectedSalaryType, setSelectedSalaryType] = useState("All");

  const [activeJob, setActiveJob] = useState<JobInfo | null>(null);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);

  const toggleBookmark = (title: string, company: string) => {
    const identifier = `${company}-${title}`;
    if (bookmarkedJobs.includes(identifier)) {
      setBookmarkedJobs(prev => prev.filter(k => k !== identifier));
      toast.success(`Removed "${title}" from saved jobs`);
    } else {
      setBookmarkedJobs(prev => [...prev, identifier]);
      toast.success(`Saved "${title}" to bookmarks!`);
    }
  };

  // Dynamically extract unique option values from the jobs data
  const uniqueLocations = useMemo(() => {
    const locs = jobs.map((j) => {
      const l = j.loc.toLowerCase();
      if (l.includes("bengaluru") || l.includes("bangalore")) return "Bengaluru";
      if (l.includes("hyderabad")) return "Hyderabad";
      if (l.includes("remote")) return "Remote";
      if (l.includes("worldwide")) return "Worldwide";
      if (l.includes("usa")) return "USA";
      if (l.includes("europe")) return "Europe";
      return j.loc;
    });
    return Array.from(new Set(locs.filter(Boolean))).sort();
  }, [jobs]);

  const uniqueSkills = useMemo(() => {
    const skills = jobs.flatMap((j) => j.skills);
    return Array.from(new Set(skills.filter(Boolean))).sort();
  }, [jobs]);

  const uniqueCompanies = useMemo(() => {
    const companies = jobs.map((j) => j.c);
    return Array.from(new Set(companies.filter(Boolean))).sort();
  }, [jobs]);

  const hasActiveFilters = searchQuery || selectedLoc !== "All" || selectedSkill !== "All" || selectedCompany !== "All" || selectedExp !== "All" || selectedSalaryType !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLoc("All");
    setSelectedSkill("All");
    setSelectedCompany("All");
    setSelectedExp("All");
    setSelectedSalaryType("All");
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      // 1. Search Query filter (match title, company, or skills)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        j.c.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q));

      // 2. Location filter
      const matchesLoc =
        selectedLoc === "All" ||
        j.loc.toLowerCase().includes(selectedLoc.toLowerCase());

      // 3. Skill filter
      const matchesSkill =
        selectedSkill === "All" ||
        j.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

      // 4. Company filter
      const matchesCompany =
        selectedCompany === "All" ||
        j.c.toLowerCase() === selectedCompany.toLowerCase();

      // 5. Experience filter (Internships vs Entry Level)
      const isIntern = j.role.toLowerCase().includes("intern") || j.role.toLowerCase().includes("co-op");
      const matchesExp =
        selectedExp === "All" ||
        (selectedExp === "Internship" && isIntern) ||
        (selectedExp === "Entry Level" && !isIntern);

      // 6. Salary Type filter
      const isPaid = j.salary && j.salary.trim() !== "" && j.salary.toLowerCase() !== "competitive" && j.salary.toLowerCase() !== "pay per task";
      const matchesSalaryType =
        selectedSalaryType === "All" ||
        (selectedSalaryType === "Paid" && isPaid) ||
        (selectedSalaryType === "Competitive" && !isPaid);

      return matchesSearch && matchesLoc && matchesSkill && matchesCompany && matchesExp && matchesSalaryType;
    });
  }, [jobs, searchQuery, selectedLoc, selectedSkill, selectedCompany, selectedExp, selectedSalaryType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommended Jobs</h1>
          <p className="mt-1 text-muted-foreground">Personalized by your skills, projects and preferences.</p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Clear Active Filters
          </button>
        )}
      </div>

      <div className="rounded-2xl p-4 glass">
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or tech skills…"
              className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter by:</span>
            </div>

            {/* Location Select */}
            <div className="relative">
              <select
                value={selectedLoc}
                onChange={(e) => setSelectedLoc(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-card px-3.5 py-2 pr-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
              >
                <option value="All">Location (All)</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
            </div>

            {/* Salary Select */}
            <div className="relative">
              <select
                value={selectedSalaryType}
                onChange={(e) => setSelectedSalaryType(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-card px-3.5 py-2 pr-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
              >
                <option value="All">Salary (All)</option>
                <option value="Paid">Stipend/Paid Info</option>
                <option value="Competitive">Competitive/TBD</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
            </div>

            {/* Skills Select */}
            <div className="relative">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-card px-3.5 py-2 pr-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
              >
                <option value="All">Skill (All)</option>
                {uniqueSkills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
            </div>

            {/* Company Select */}
            <div className="relative">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-card px-3.5 py-2 pr-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
              >
                <option value="All">Company (All)</option>
                {uniqueCompanies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
            </div>

            {/* Experience Select */}
            <div className="relative">
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-card px-3.5 py-2 pr-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
              >
                <option value="All">Experience (All)</option>
                <option value="Internship">Internship</option>
                <option value="Entry Level">Entry Level</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border glass">
          <Building2 className="h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="font-semibold text-lg">No matching roles found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">No items matched your current search parameters. Try clearing your filters to see more recommendations.</p>
          <button
            onClick={clearFilters}
            className="mt-4 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((j, i) => (
            <div key={j.c + j.role + i} className="rounded-2xl p-6 glass transition-all hover:-translate-y-1 hover:shadow-lg duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-white shadow-md">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary/80">{j.c}</div>
                    <div className="text-base font-bold text-foreground line-clamp-1">{j.role}</div>
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary shadow-sm">{j.match}% match</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2 py-1"><MapPin className="h-3.5 w-3.5 text-primary/70" /> {j.loc}</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2 py-1"><DollarSign className="h-3.5 w-3.5 text-primary/70" /> {j.salary}</span>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {j.skills.map((s) => (
                  <span key={s} className="rounded-lg bg-accent px-2 py-1 text-xs font-medium text-accent-foreground border border-border/40 hover:bg-accent/80 transition-colors cursor-default">{s}</span>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <button 
                  onClick={() => setActiveJob(j)}
                  className="flex-1 rounded-xl border border-border px-3 py-2 text-sm font-semibold hover:bg-accent active:scale-95 transition-all cursor-pointer"
                >
                  View
                </button>
                <button 
                  onClick={() => {
                    if (j.url) {
                      toast.success(`Opening application portal for ${j.role} at ${j.c}`);
                      window.open(j.url, "_blank");
                    }
                  }}
                  className="flex-1 rounded-xl px-3 py-2 text-sm font-bold btn-gradient shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Apply
                </button>
                <button
                  onClick={() => toggleBookmark(j.role, j.c)}
                  className={`grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-accent active:scale-95 transition-all cursor-pointer ${
                    bookmarkedJobs.includes(`${j.c}-${j.role}`) ? "bg-primary/10 text-primary border-primary" : ""
                  }`}
                  aria-label="Save"
                >
                  <Bookmark className="h-4 w-4" fill={bookmarkedJobs.includes(`${j.c}-${j.role}`) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Dialog overlay */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-2xl rounded-2xl flex flex-col max-h-[85vh] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-white shadow-md">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{activeJob.c}</div>
                  <h2 className="text-xl font-extrabold text-foreground">{activeJob.role}</h2>
                </div>
              </div>
              <button 
                onClick={() => setActiveJob(null)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
                aria-label="Close details"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground mr-1">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/50 px-3 py-1.5"><MapPin className="h-4 w-4 text-primary/70" /> {activeJob.loc}</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/50 px-3 py-1.5"><DollarSign className="h-4 w-4 text-primary/70" /> {activeJob.salary}</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary px-3 py-1.5">{activeJob.match}% Match score</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeJob.skills.map((s) => (
                    <span key={s} className="rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground border border-border/40">{s}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Job Description</h3>
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/80 leading-relaxed font-normal space-y-3"
                  dangerouslySetInnerHTML={{ __html: activeJob.desc || "No description loaded." }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30 flex gap-3 justify-end">
              <button 
                onClick={() => setActiveJob(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-accent transition-all cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  if (activeJob.url) {
                    toast.success(`Opening application portal for ${activeJob.role} at ${activeJob.c}`);
                    window.open(activeJob.url, "_blank");
                  }
                }}
                className="rounded-xl px-5 py-2 text-sm font-bold btn-gradient shadow-md cursor-pointer transition-all active:scale-95"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
