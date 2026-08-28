import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  Filter,
  Building2,
  Bookmark,
  ChevronDown,
  RotateCcw,
  X,
  ExternalLink,
  CheckCircle2,
  Briefcase,
  IndianRupee,
  Clock,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Check,
  Send
} from "lucide-react";
import { toast } from "sonner";

import { getDailyJobs, forceRefreshJobs, type JobInfo } from "../lib/job-fetcher";

export const Route = createFileRoute("/dashboard/jobs")({
  head: () => ({
    meta: [
      { title: "Recommended Engineering Jobs (Naukri & Live Feed) — Placify AI" },
      { name: "description", content: "1,400+ authentic Naukri engineering jobs personalized for your student profile." },
      { property: "og:title", content: "Recommended Engineering Jobs — Placify AI" },
      { property: "og:description", content: "1,400+ authentic Naukri engineering jobs." },
    ],
  }),
  loader: async () => (await getDailyJobs()) as JobInfo[],
  component: JobsPage,
});

const CATEGORIES = [
  { label: "All Engineering", value: "All" },
  { label: "Software Dev", value: "Software Dev" },
  { label: "AI & Data Science", value: "AI & Data Science" },
  { label: "Full Stack", value: "Full Stack" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Cloud & DevOps", value: "Cloud & DevOps" },
  { label: "Internships", value: "Internship" },
  { label: "Core Tech & Embedded", value: "Core Tech" },
  { label: "QA & SDET", value: "QA / SDET" },
  { label: "Mobile Dev", value: "Mobile Dev" },
];

function JobsPage() {
  const initialJobs = Route.useLoaderData() || [];
  const [jobs, setJobs] = useState<JobInfo[]>(initialJobs);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLoc, setSelectedLoc] = useState("All");
  const [selectedExp, setSelectedExp] = useState("All");
  const [selectedSalaryRange, setSelectedSalaryRange] = useState("All");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [sortBy, setSortBy] = useState<"match" | "salary" | "recent">("match");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);

  // Active Job Details Modal
  const [activeJob, setActiveJob] = useState<JobInfo | null>(null);

  // Saved / Bookmarked & Applied State
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("placify_saved_jobs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    try {
      const applied = localStorage.getItem("placify_applied_jobs");
      return applied ? JSON.parse(applied) : [];
    } catch {
      return [];
    }
  });

  // Custom Naukri Direct Search Modal
  const [showNaukriSearchModal, setShowNaukriSearchModal] = useState(false);
  const [customNaukriKeyword, setCustomNaukriKeyword] = useState("");
  const [customNaukriLocation, setCustomNaukriLocation] = useState("Bengaluru");

  useEffect(() => {
    try {
      localStorage.setItem("placify_saved_jobs", JSON.stringify(bookmarkedJobs));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedJobs]);

  useEffect(() => {
    try {
      localStorage.setItem("placify_applied_jobs", JSON.stringify(appliedJobs));
    } catch (e) {
      console.error(e);
    }
  }, [appliedJobs]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLoc, selectedExp, selectedSalaryRange, selectedWorkMode, selectedCompany, sortBy, pageSize]);

  // Handle Sync / Force Refresh
  const handleRefreshFeed = async () => {
    try {
      setIsRefreshing(true);
      toast.loading("Synchronizing live feed with Naukri.com & Engineering portals...", { id: "sync-feed" });
      const refreshed = await forceRefreshJobs();
      setJobs(refreshed);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      toast.success(`Successfully synchronized ${refreshed.length.toLocaleString()} active Engineering jobs!`, { id: "sync-feed" });
    } catch (e) {
      toast.error("Failed to re-sync live feed. Using cached data.", { id: "sync-feed" });
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleBookmark = (jobId: string, title: string) => {
    if (bookmarkedJobs.includes(jobId)) {
      setBookmarkedJobs((prev) => prev.filter((id) => id !== jobId));
      toast.success(`Removed "${title}" from saved bookmarks.`);
    } else {
      setBookmarkedJobs((prev) => [...prev, jobId]);
      toast.success(`Saved "${title}" to your bookmarks!`);
    }
  };

  const markAsApplied = (job: JobInfo) => {
    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs((prev) => [...prev, job.id]);
      toast.success(`Marked application submitted for ${job.role} at ${job.c}! Added to Application Tracker.`);
    } else {
      toast.info(`You have already marked ${job.role} at ${job.c} as applied.`);
    }
  };

  // Extract unique locations and companies
  const uniqueLocations = useMemo(() => {
    const locs = jobs.map((j) => j.loc);
    return Array.from(new Set(locs.filter(Boolean))).sort();
  }, [jobs]);

  const uniqueCompanies = useMemo(() => {
    const comps = jobs.map((j) => j.c);
    return Array.from(new Set(comps.filter(Boolean))).sort();
  }, [jobs]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: jobs.length };
    jobs.forEach((j) => {
      counts[j.category] = (counts[j.category] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    selectedLoc !== "All" ||
    selectedExp !== "All" ||
    selectedSalaryRange !== "All" ||
    selectedWorkMode !== "All" ||
    selectedCompany !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLoc("All");
    setSelectedExp("All");
    setSelectedSalaryRange("All");
    setSelectedWorkMode("All");
    setSelectedCompany("All");
    setSortBy("match");
  };

  // Filter & Sort jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((j) => {
      // 1. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const inCompany = j.c.toLowerCase().includes(q);
        const inRole = j.role.toLowerCase().includes(q);
        const inLoc = j.loc.toLowerCase().includes(q);
        const inSkills = j.skills.some((s) => s.toLowerCase().includes(q));
        if (!inCompany && !inRole && !inLoc && !inSkills) return false;
      }

      // 2. Category
      if (selectedCategory !== "All" && j.category !== selectedCategory) {
        return false;
      }

      // 3. Location
      if (selectedLoc !== "All") {
        if (!j.loc.toLowerCase().includes(selectedLoc.toLowerCase())) {
          return false;
        }
      }

      // 4. Experience
      if (selectedExp !== "All") {
        if (selectedExp === "Internship" && j.exp !== "Internship") return false;
        if (selectedExp === "Fresher" && !j.exp.toLowerCase().includes("fresher") && !j.exp.includes("0-1")) return false;
        if (selectedExp === "1-3 yrs" && !j.exp.includes("1-3")) return false;
        if (selectedExp === "3-5 yrs" && !j.exp.includes("3-5")) return false;
      }

      // 5. Salary Range
      if (selectedSalaryRange !== "All") {
        if (selectedSalaryRange === "Stipend" && !j.salary.includes("/ mo")) return false;
        if (selectedSalaryRange === "8LPA" && j.salaryVal < 8) return false;
        if (selectedSalaryRange === "15LPA" && j.salaryVal < 15) return false;
        if (selectedSalaryRange === "25LPA" && j.salaryVal < 25) return false;
      }

      // 6. Work Mode
      if (selectedWorkMode !== "All" && j.workMode !== selectedWorkMode) {
        return false;
      }

      // 7. Company
      if (selectedCompany !== "All" && j.c !== selectedCompany) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "match") {
        return b.match - a.match;
      }
      if (sortBy === "salary") {
        return b.salaryVal - a.salaryVal;
      }
      if (sortBy === "recent") {
        // "Just now" or "Today" first
        const isRecentA = a.posted.includes("Today") || a.posted.includes("Just now") ? 1 : 0;
        const isRecentB = b.posted.includes("Today") || b.posted.includes("Just now") ? 1 : 0;
        return isRecentB - isRecentA;
      }
      return 0;
    });

    return result;
  }, [jobs, searchQuery, selectedCategory, selectedLoc, selectedExp, selectedSalaryRange, selectedWorkMode, selectedCompany, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      scrollToTop();
    }
  };

  const openNaukriSearch = () => {
    const q = encodeURIComponent(customNaukriKeyword || "Software Engineer Fresher");
    const loc = encodeURIComponent(customNaukriLocation || "India");
    window.open(`https://www.naukri.com/${customNaukriKeyword ? customNaukriKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "software-engineer"}-jobs-in-${customNaukriLocation ? customNaukriLocation.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "india"}?k=${q}&l=${loc}`, "_blank");
    setShowNaukriSearchModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Live Naukri Status Banner */}
      <div className="rounded-3xl p-6 md:p-8 glass relative overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/5 via-accent/20 to-primary/5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Naukri.com & Tech Portals Live Feed • Synced ({lastSyncTime})
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Recommended Engineering Jobs
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Browsing <span className="font-bold text-foreground">{jobs.length.toLocaleString()}+</span> active verified engineering positions across top Indian tech giants, product startups, and global teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-bold hover:bg-accent transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
              {isRefreshing ? "Syncing..." : "Sync Naukri Feed"}
            </button>

            <button
              onClick={() => setShowNaukriSearchModal(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold btn-gradient shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 text-white"
            >
              <Search className="h-3.5 w-3.5" />
              Search Directly on Naukri
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs Carousel */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.value] || 0;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md scale-102"
                    : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-accent/70"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl p-4 md:p-5 glass border border-border/80 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 1,400+ engineering roles by keywords (e.g. SDE Intern, Python, React, Pune, Google, AWS)..."
            className="w-full rounded-xl border border-border bg-card/90 pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-1">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span>Filters:</span>
          </div>

          {/* Location Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
            >
              <option value="All">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
          </div>

          {/* Experience Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
            >
              <option value="All">All Experience</option>
              <option value="Internship">Internships</option>
              <option value="Fresher">Fresher (0-1 yr)</option>
              <option value="1-3 yrs">1-3 Years</option>
              <option value="3-5 yrs">3-5 Years</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
          </div>

          {/* Salary Band Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedSalaryRange}
              onChange={(e) => setSelectedSalaryRange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
            >
              <option value="All">All Salaries</option>
              <option value="Stipend">Internship Stipends</option>
              <option value="8LPA">&gt; ₹8 LPA</option>
              <option value="15LPA">&gt; ₹15 LPA</option>
              <option value="25LPA">&gt; ₹25 LPA (Top Tier)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
          </div>

          {/* Work Mode Dropdown */}
          <div className="relative min-w-[110px]">
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
            >
              <option value="All">All Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="In-office">In-Office</option>
              <option value="Remote">Remote</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
          </div>

          {/* Company Filter Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-card px-3 py-2 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-accent transition-colors"
            >
              <option value="All">All Companies ({uniqueCompanies.length})</option>
              {uniqueCompanies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative min-w-[130px] ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full appearance-none rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 pr-8 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
            >
              <option value="match">Sort: AI Match %</option>
              <option value="salary">Sort: Salary (High)</option>
              <option value="recent">Sort: Recently Posted</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary opacity-70 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div>
          Showing <span className="font-bold text-foreground">{Math.min(filteredJobs.length, (currentPage - 1) * pageSize + 1)}</span>–
          <span className="font-bold text-foreground">{Math.min(filteredJobs.length, currentPage * pageSize)}</span> of{" "}
          <span className="font-bold text-foreground">{filteredJobs.length.toLocaleString()}</span> engineering jobs
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span>Show per page:</span>
          {[12, 18, 36, 72].map((size) => (
            <button
              key={size}
              onClick={() => setPageSize(size)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                pageSize === size ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-accent"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border border-dashed border-border glass">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
            <Building2 className="h-8 w-8 opacity-60" />
          </div>
          <h3 className="font-bold text-xl">No engineering jobs matched your filters</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            Try adjusting your search keywords, location or experience criteria to explore our 1,400+ engineering catalogue.
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold btn-gradient shadow-md cursor-pointer text-white active:scale-95"
          >
            <RotateCcw className="h-4 w-4" /> Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedJobs.map((j) => {
            const isSaved = bookmarkedJobs.includes(j.id);
            const isApplied = appliedJobs.includes(j.id);
            const isHighMatch = j.match >= 90;

            return (
              <div
                key={j.id}
                className="group relative flex flex-col justify-between rounded-2xl p-5 md:p-6 glass border border-border/80 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card/60"
              >
                <div>
                  {/* Top Row: Company & Match Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-brand text-white font-black text-base shadow-sm">
                        {j.c.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-primary truncate">{j.c}</span>
                          <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            Naukri
                          </span>
                        </div>
                        <h2 className="text-sm md:text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {j.role}
                        </h2>
                      </div>
                    </div>

                    <div
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold shadow-xs ${
                        isHighMatch
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {j.match}% match
                    </div>
                  </div>

                  {/* Metadata Chips: Location, Salary, Experience */}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/60 px-2.5 py-1">
                      <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                      <span className="truncate">{j.loc}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/60 px-2.5 py-1 font-semibold text-foreground">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      {j.salary}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/60 px-2 py-1">
                      <Briefcase className="h-3 w-3 text-primary/70 shrink-0" />
                      {j.exp}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/60 px-2 py-1">
                      <Laptop className="h-3 w-3 text-primary/70 shrink-0" />
                      {j.workMode}
                    </span>
                  </div>

                  {/* Skills Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {j.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-accent/80 px-2 py-0.5 text-[11px] font-semibold text-accent-foreground border border-border/40"
                      >
                        {s}
                      </span>
                    ))}
                    {j.skills.length > 4 && (
                      <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium">
                        +{j.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Openings & Batch info */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground/80 border-t border-border/40 pt-2.5">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Clock className="h-3 w-3" /> {j.posted}
                    </span>
                    <span className="font-medium text-foreground/80">{j.openings}</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="mt-4 flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveJob(j)}
                    className="flex-1 rounded-xl border border-border bg-card/80 px-3 py-2 text-xs font-bold hover:bg-accent active:scale-95 transition-all cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      toast.success(`Redirecting to Naukri verified portal for ${j.role} at ${j.c}...`);
                      window.open(j.url, "_blank");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold btn-gradient text-white shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Apply</span>
                    <ExternalLink className="h-3 w-3 opacity-80" />
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(j.id, j.role)}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border hover:bg-accent active:scale-95 transition-all cursor-pointer ${
                      isSaved ? "bg-primary/15 text-primary border-primary" : "text-muted-foreground"
                    }`}
                    aria-label="Save"
                    title={isSaved ? "Saved in bookmarks" : "Save job"}
                  >
                    <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                  </button>

                  {/* Applied Checkmark Button */}
                  <button
                    onClick={() => markAsApplied(j)}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border hover:bg-accent active:scale-95 transition-all cursor-pointer ${
                      isApplied ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/50" : "text-muted-foreground"
                    }`}
                    aria-label="Mark as Applied"
                    title={isApplied ? "Marked as Applied" : "Mark as Applied"}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl p-4 glass border border-border/80 mt-6 shadow-xs">
          <div className="text-xs text-muted-foreground">
            Page <span className="font-bold text-foreground">{currentPage}</span> of{" "}
            <span className="font-bold text-foreground">{totalPages}</span> ({filteredJobs.length.toLocaleString()} total jobs)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold hover:bg-accent disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>

            {/* Smart page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-primary text-primary-foreground shadow-sm scale-105"
                      : "bg-card border border-border hover:bg-accent text-muted-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold hover:bg-accent disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Details Dialog Modal */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-2xl rounded-3xl flex flex-col max-h-[90vh] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border/80 bg-muted/20 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl gradient-brand text-white font-black text-xl shadow-md">
                  {activeJob.c.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{activeJob.c}</span>
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      Naukri Verified
                    </span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {activeJob.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-foreground mt-0.5">{activeJob.role}</h2>
                </div>
              </div>
              <button
                onClick={() => setActiveJob(null)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-accent transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
              {/* Highlight Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl border border-border bg-card p-3">
                  <div className="text-[11px] text-muted-foreground">Location</div>
                  <div className="font-bold text-foreground flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {activeJob.loc}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                  <div className="text-[11px] text-muted-foreground">Salary / Package</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 truncate">
                    <IndianRupee className="h-3.5 w-3.5" /> {activeJob.salary}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                  <div className="text-[11px] text-muted-foreground">Experience</div>
                  <div className="font-bold text-foreground flex items-center gap-1 mt-0.5 truncate">
                    <Briefcase className="h-3.5 w-3.5 text-primary" /> {activeJob.exp}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                  <div className="text-[11px] text-muted-foreground">Profile Match</div>
                  <div className="font-extrabold text-primary flex items-center gap-1 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> {activeJob.match}% Match
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Required Tech Stack & Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeJob.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-accent-foreground border border-border/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Batch Eligibility */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Eligible Batches:</span>
                <span className="font-bold text-primary">{activeJob.batchEligible || "2024 / 2025 / 2026 Batch Graduates & Final Years"}</span>
              </div>

              {/* Job Description */}
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Job Description & Responsibilities</h3>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-normal space-y-3"
                  dangerouslySetInnerHTML={{ __html: activeJob.desc }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex flex-wrap gap-2.5 justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(activeJob.id, activeJob.role)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-bold hover:bg-accent transition-all cursor-pointer ${
                    bookmarkedJobs.includes(activeJob.id) ? "bg-primary/10 text-primary border-primary" : ""
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" fill={bookmarkedJobs.includes(activeJob.id) ? "currentColor" : "none"} />
                  {bookmarkedJobs.includes(activeJob.id) ? "Saved" : "Save Job"}
                </button>

                <button
                  onClick={() => markAsApplied(activeJob)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-bold hover:bg-accent transition-all cursor-pointer ${
                    appliedJobs.includes(activeJob.id) ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/40" : ""
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {appliedJobs.includes(activeJob.id) ? "Applied ✓" : "Mark as Applied"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveJob(null)}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-bold hover:bg-accent transition-all cursor-pointer"
                >
                  Close
                </button>

                {activeJob.careerUrl && (
                  <button
                    onClick={() => {
                      toast.success(`Opening official career portal for ${activeJob.c}`);
                      window.open(activeJob.careerUrl, "_blank");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Company Portal</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    toast.success(`Opening verified Naukri listing for ${activeJob.role} at ${activeJob.c}`);
                    window.open(activeJob.url, "_blank");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold btn-gradient text-white shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <span>Apply on Naukri</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Naukri Search Launcher Modal */}
      {showNaukriSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white font-bold text-xs">
                  N
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Direct Search on Naukri.com</h3>
                  <p className="text-xs text-muted-foreground">Search all live engineering vacancies with your custom query.</p>
                </div>
              </div>
              <button
                onClick={() => setShowNaukriSearchModal(false)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-accent cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Target Engineering Role / Keyword</label>
                <input
                  type="text"
                  value={customNaukriKeyword}
                  onChange={(e) => setCustomNaukriKeyword(e.target.value)}
                  placeholder="e.g. SDE Fresher, AI Engineer, Fullstack React, Embedded Systems"
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Target Location</label>
                <select
                  value={customNaukriLocation}
                  onChange={(e) => setCustomNaukriLocation(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="India">All India</option>
                  <option value="Bengaluru">Bengaluru / Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Delhi NCR">Delhi / NCR (Noida / Gurugram)</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowNaukriSearchModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-bold hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={openNaukriSearch}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold btn-gradient text-white shadow-md cursor-pointer active:scale-95"
              >
                <span>Launch Search on Naukri</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
