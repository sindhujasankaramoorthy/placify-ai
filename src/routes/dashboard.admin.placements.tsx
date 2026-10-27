import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Award,
  Layers,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ShieldCheck,
  Calendar,
  DollarSign,
  GraduationCap,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Check,
  Eye,
  Info,
  Lock
} from "lucide-react";
import {
  getActiveUser,
  switchRole,
  onAuthChange,
  PlacifyUser
} from "@/lib/auth";
import {
  ResponsiveContainer,
  BarChart,

  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { toast } from "sonner";
import {
  PlacementSummary,
  CompanyPlacementStat,
  StudentPlacementRecord,
  CompanyPlacedStudent,
  StudentDetailProfile,
  PlacementAnalyticsResponse,
  PlacementFilters,
  fetchPlacementSummary,
  fetchCompanyPlacements,
  fetchCompanyStudents,
  fetchStudentRegister,
  fetchStudentDetail,
  fetchPlacementAnalytics,
  getExportDownloadUrl,
  triggerDemoDataSeed
} from "@/lib/api/placements";

export const Route = createFileRoute("/dashboard/admin/placements")({
  head: () => ({
    meta: [
      { title: "Placement Cell Admin Dashboard — Placify AI" },
      { name: "description", content: "College Placement Cell Analytics & Student-Company Register" },
      { property: "og:title", content: "Placement Cell Admin Dashboard — Placify AI" },
      { property: "og:description", content: "Comprehensive institutional placement performance and student offer tracker." },
    ],
  }),
  component: AdminPlacementsDashboard,
});

type ActiveTab = "overview" | "companies" | "students" | "analytics" | "reports" | "settings";

const ACADEMIC_YEARS = ["All Batches", "2025-2026", "2024-2025", "2023-2024"];
const DEPARTMENTS = [
  { label: "All Departments", value: "all" },
  { label: "Computer Science (CSE)", value: "CSE" },
  { label: "Information Tech (IT)", value: "IT" },
  { label: "AI & Data Science (AI&DS)", value: "AI&DS" },
  { label: "Electronics & Comm (ECE)", value: "ECE" },
  { label: "Electrical & Electronics (EEE)", value: "EEE" },
  { label: "Mechanical Engg (MECH)", value: "MECH" },
];

export function AdminPlacementsDashboard() {
  // Current User & Role (Admin vs Student)
  const [currentUser, setCurrentUser] = useState<PlacifyUser>(getActiveUser());
  const isStudent = currentUser.role === "student";

  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [academicYear, setAcademicYear] = useState<string>("2025-2026");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [multipleOffersOnly, setMultipleOffersOnly] = useState<boolean>(false);
  const [packageBracket, setPackageBracket] = useState<string>("all");

  // Pagination & Sorting
  const [companyPage, setCompanyPage] = useState<number>(1);
  const [companySortBy, setCompanySortBy] = useState<string>("unique_placed");
  const [companySortOrder, setCompanySortOrder] = useState<"asc" | "desc">("desc");

  const [studentPage, setStudentPage] = useState<number>(1);
  const [studentSortBy, setStudentSortBy] = useState<string>("name");
  const [studentSortOrder, setStudentSortOrder] = useState<"asc" | "desc">("asc");

  // Data Loading States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [summary, setSummary] = useState<PlacementSummary | null>(null);
  const [companiesData, setCompaniesData] = useState<{ items: CompanyPlacementStat[]; total: number; total_pages: number } | null>(null);
  const [studentsData, setStudentsData] = useState<{ items: StudentPlacementRecord[]; total: number; total_pages: number } | null>(null);
  const [analytics, setAnalytics] = useState<PlacementAnalyticsResponse | null>(null);

  // Modal / Drawer States
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [companyDetail, setCompanyDetail] = useState<{ company_name: string; students: CompanyPlacedStudent[] } | null>(null);
  const [isLoadingCompanyStudents, setIsLoadingCompanyStudents] = useState<boolean>(false);

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [studentDetail, setStudentDetail] = useState<StudentDetailProfile | null>(null);
  const [isLoadingStudentDetail, setIsLoadingStudentDetail] = useState<boolean>(false);

  useEffect(() => {
    setCurrentUser(getActiveUser());
    const unsub = onAuthChange((u) => {
      setCurrentUser(u);
    });
    return unsub;
  }, []);


  // Load Main Dashboard Data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const filters: PlacementFilters = {
        academic_year: academicYear === "All Batches" ? undefined : academicYear,
        department: selectedDept === "all" ? undefined : selectedDept,
      };

      const [summaryRes, compRes, stuRes, analyticsRes] = await Promise.all([
        fetchPlacementSummary(filters),
        fetchCompanyPlacements({
          ...filters,
          page: companyPage,
          limit: 10,
          sort_by: companySortBy,
          sort_order: companySortOrder,
        }),
        fetchStudentRegister({
          ...filters,
          placement_status: selectedStatus === "all" ? undefined : selectedStatus,
          multiple_offers_only: multipleOffersOnly || undefined,
          search: searchQuery || undefined,
          page: studentPage,
          limit: 15,
          sort_by: studentSortBy,
          sort_order: studentSortOrder,
        }),
        fetchPlacementAnalytics(filters.academic_year, filters.department),
      ]);

      setSummary(summaryRes);
      setCompaniesData({ items: compRes.items, total: compRes.total, total_pages: compRes.total_pages });
      setStudentsData({ items: stuRes.items, total: stuRes.total, total_pages: stuRes.total_pages });
      setAnalytics(analyticsRes);
    } catch (err: any) {
      console.error("[Placement Admin] Load error:", err);
      toast.error("Failed to load placement data. Ensure backend is running.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [academicYear, selectedDept, companyPage, companySortBy, companySortOrder, currentUser]);


  // Separate effect for student filters to avoid re-fetching everything
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudentRegister({
        academic_year: academicYear === "All Batches" ? undefined : academicYear,
        department: selectedDept === "all" ? undefined : selectedDept,
        placement_status: selectedStatus === "all" ? undefined : selectedStatus,
        multiple_offers_only: multipleOffersOnly || undefined,
        search: searchQuery || undefined,
        page: studentPage,
        limit: 15,
        sort_by: studentSortBy,
        sort_order: studentSortOrder,
      })
        .then((res) => {
          setStudentsData({ items: res.items, total: res.total, total_pages: res.total_pages });
        })
        .catch((err) => console.error("Error filtering students:", err));
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedStatus, multipleOffersOnly, searchQuery, studentPage, studentSortBy, studentSortOrder]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
    toast.success("Placement records refreshed from database.");
  };

  // Open Company Placed Students Drawer / Modal
  const handleOpenCompanyStudents = async (companyId: number, companyName: string) => {
    setSelectedCompanyId(companyId);
    setIsLoadingCompanyStudents(true);
    try {
      const res = await fetchCompanyStudents(
        companyId,
        academicYear === "All Batches" ? undefined : academicYear
      );
      setCompanyDetail({ company_name: res.company_name, students: res.students });
    } catch (err) {
      toast.error(`Failed to load student list for ${companyName}`);
    } finally {
      setIsLoadingCompanyStudents(false);
    }
  };

  // Open Student Detail Profile Modal
  const handleOpenStudentDetail = async (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsLoadingStudentDetail(true);
    try {
      const res = await fetchStudentDetail(studentId);
      setStudentDetail(res);
    } catch (err) {
      toast.error("Failed to load student profile.");
    } finally {
      setIsLoadingStudentDetail(false);
    }
  };

  // Trigger Demo Seed
  const handleReSeed = async () => {
    try {
      const res = await triggerDemoDataSeed();
      toast.success(res.message);
      loadDashboardData();
    } catch (err) {
      toast.error("Failed to seed demo data.");
    }
  };

  return (
    <div className="space-y-6 text-foreground font-sans">
      {/* Top Header & Navigation Banner */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                isStudent
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                  : "bg-blue-500/20 text-blue-300 border-blue-400/30"
              }`}>
                {isStudent ? <GraduationCap className="h-3.5 w-3.5 text-emerald-400" /> : <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />}
                {isStudent ? "Student Placement Insights (Partial Details)" : "Training & Placement Cell Admin (Full Access)"}
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400">
                Sri Shakthi Institute of Engineering & Technology
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              {isStudent ? "Campus Placement Insights" : "Placement Analytics & Records"}
              {isRefreshing && <RefreshCw className="h-5 w-5 animate-spin text-blue-400" />}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {isStudent
                ? "Institutional placement performance, recruiting company salary ranges, and hiring trends for students."
                : "Real-time institutional placement performance, multi-offer tracking, and company-wise student recruitment statistics."}
            </p>
          </div>

          {/* Academic Year Selector & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl px-3 py-1.5">
              <Calendar className="h-4 w-4 text-blue-400" />
              <label className="text-xs font-medium text-slate-300">Cohort:</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900 text-white">
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Switch Role Button */}
            <button
              onClick={() => {
                const nextRole = isStudent ? "admin" : "student";
                const u = switchRole(nextRole);
                setCurrentUser(u);
                toast.success(`Switched role to: ${u.role === "admin" ? "Placement Cell Administrator" : "Student View"}`);
              }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              {isStudent ? <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> : <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />}
              <span>Switch to {isStudent ? "Admin" : "Student"}</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>

            {!isStudent && (
              <a
                href={getExportDownloadUrl("students", academicYear === "All Batches" ? undefined : academicYear)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-blue-300" />
                Export CSV
              </a>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "companies", label: isStudent ? "Company Recruits" : "Company Placements", icon: Building2, highlight: true },
            { id: "students", label: isStudent ? "My Placement Status" : "Student Directory", icon: Users },
            { id: "analytics", label: "Placement Analytics", icon: TrendingUp },
            { id: "reports", label: "Reports & Exports", icon: FileSpreadsheet, adminOnly: true },
            { id: "settings", label: "Settings & Policy", icon: SlidersHorizontal, adminOnly: true },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.adminOnly && isStudent) {
                    toast.info(`The "${tab.label}" tab is restricted to Placement Administrators.`);
                  }
                  setActiveTab(tab.id as ActiveTab);
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <tab.icon className={`h-4 w-4 ${active ? "text-white" : "text-blue-400"}`} />
                {tab.label}
                {tab.adminOnly && isStudent && (
                  <Lock className="h-3 w-3 text-slate-400" />
                )}
                {tab.highlight && (
                  <span className="ml-1 rounded-full bg-blue-400/20 px-1.5 py-0.5 text-[10px] text-blue-200">
                    Primary
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Banner for Student Mode */}
      {isStudent && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-foreground">Student Mode: Institutional Placement Insights (Partial Details View)</span>
              <p className="text-muted-foreground mt-0.5">
                Viewing campus-wide recruitment averages, company hiring numbers, and compensation brackets. Peer student contact info, register numbers, and compliance CSV exports are restricted under college privacy policy.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const u = switchRole("admin");
              setCurrentUser(u);
              toast.success("Switched to Placement Officer Admin Mode.");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-bold shrink-0 cursor-pointer shadow-sm transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Switch to Admin View
          </button>
        </div>
      )}

      {/* Global Filter Bar (Present on relevant tabs) */}
      {(activeTab === "overview" || activeTab === "companies" || activeTab === "students" || activeTab === "analytics") && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 pl-1">
              <Filter className="h-3.5 w-3.5 text-primary" /> Filter by:
            </span>

            {/* Department Dropdown */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* Placement Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Placed">Placed Students</option>
              <option value="In Progress">In Progress (Interview/Test)</option>
              <option value="Not Placed">Not Yet Placed</option>
            </select>

            {/* Multiple Offers Toggle */}
            <label className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-accent">
              <input
                type="checkbox"
                checked={multipleOffersOnly}
                onChange={(e) => setMultipleOffersOnly(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span className={multipleOffersOnly ? "text-primary font-bold" : "text-muted-foreground"}>
                Multiple Offers Only
              </span>
            </label>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search student, reg no, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 10 Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-5">
        {[
          {
            label: "Eligible Students",
            val: summary ? summary.total_eligible_students : "—",
            sub: "Total cohort pool",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Students Placed",
            val: summary ? summary.students_placed : "—",
            sub: "Unique distinct placed",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            change: summary?.comparison.placed_change_pct,
          },
          {
            label: "Not Yet Placed",
            val: summary ? summary.students_not_placed : "—",
            sub: "Active placement pipeline",
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
          {
            label: "Placement Rate",
            val: summary ? `${summary.placement_percentage}%` : "—",
            sub: "Placed / Eligible ratio",
            icon: TrendingUp,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            change: summary?.comparison.placement_rate_change_pct,
          },
          {
            label: "Recruiting Companies",
            val: summary ? summary.total_companies_recruiting : "—",
            sub: "Participating recruiters",
            icon: Building2,
            color: "text-sky-500",
            bg: "bg-sky-500/10",
          },
          {
            label: "Total Offers Issued",
            val: summary ? summary.total_offers_received : "—",
            sub: "Distinct verified offers",
            icon: Award,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            change: summary?.comparison.offers_change_pct,
          },
          {
            label: "Multiple Offers",
            val: summary ? summary.students_multiple_offers : "—",
            sub: "Students with 2+ offers",
            icon: Sparkles,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
          },
          {
            label: "Highest Package",
            val: summary ? `₹${summary.highest_package_lpa} LPA` : "—",
            sub: "Super Dream tier offer",
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Average Package",
            val: summary ? `₹${summary.average_package_lpa} LPA` : "—",
            sub: "Mean salary (placed)",
            icon: DollarSign,
            color: "text-teal-600",
            bg: "bg-teal-500/10",
            change: summary?.comparison.avg_package_change_pct,
          },
          {
            label: "Median Package",
            val: summary ? `₹${summary.median_package_lpa} LPA` : "—",
            sub: "50th percentile offer",
            icon: DollarSign,
            color: "text-cyan-600",
            bg: "bg-cyan-500/10",
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {kpi.label}
              </span>
              <div className={`grid h-8 w-8 place-items-center rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black tracking-tight">{kpi.val}</div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="truncate">{kpi.sub}</span>
                {kpi.change !== undefined && kpi.change !== null && (
                  <span
                    className={`inline-flex items-center font-bold shrink-0 ${
                      kpi.change >= 0 ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {kpi.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(kpi.change)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Main Visual Highlights Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left 2 Cols: Company Recruitment Bar Chart */}
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Company-Wise Recruitment Overview</h2>
                  <p className="text-xs text-muted-foreground">
                    Number of unique students placed per recruiting organization (click bar for student list)
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("companies")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  View Full Table <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="h-72 w-full">
                {analytics && analytics.company_chart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.company_chart}
                      margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis
                        dataKey="company"
                        angle={-30}
                        textAnchor="end"
                        tick={{ fontSize: 11 }}
                        interval={0}
                        height={55}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-xs space-y-1">
                                <div className="font-bold text-foreground">{data.company}</div>
                                <div className="text-emerald-500 font-semibold">
                                  {data.placed_students} unique students placed
                                </div>
                                <div className="text-muted-foreground">
                                  Average Package: ₹{data.avg_package} LPA
                                </div>
                                <div className="text-[10px] text-primary italic pt-1">
                                  Click bar to inspect students
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="placed_students"
                        name="Placed Students"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                        onClick={(data) => {
                          if (data && data.company_id) {
                            handleOpenCompanyStudents(data.company_id, data.company);
                          }
                        }}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No company recruitment records available for this cohort.
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Placement Status Donut */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Placement Status</h2>
                <p className="text-xs text-muted-foreground">Distribution across verified cohort</p>
              </div>

              <div className="h-56 w-full relative">
                {analytics && analytics.status_distribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.status_distribution}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {analytics.status_distribution.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-xl border border-border bg-popover p-2 text-xs shadow-md">
                                <span className="font-semibold">{data.status}: </span>
                                {data.count} students ({data.percentage}%)
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No status data.
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t border-border pt-4 text-xs">
                {analytics?.status_distribution.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.status}</span>
                    </span>
                    <span className="font-semibold">
                      {item.count} <span className="text-muted-foreground font-normal">({item.percentage}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Feature Preview: "Which Students Were Placed at Which Company?" */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Which Students Were Placed at Which Company?
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any company row to reveal the exact student roster, packages, and offer statuses.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("companies")}
                className="inline-flex items-center gap-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
              >
                Open Full Company Matrix <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Compact Company Table */}
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-3">Industry</th>
                    <th className="py-3 px-3 text-center">Applied</th>
                    <th className="py-3 px-3 text-center font-bold text-primary">Students Placed</th>
                    <th className="py-3 px-3 text-center">Total Offers</th>
                    <th className="py-3 px-3">Avg Package</th>
                    <th className="py-3 px-3">Highest Package</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {companiesData && companiesData.items.length > 0 ? (
                    companiesData.items.slice(0, 6).map((c) => (
                      <tr
                        key={c.company_id}
                        onClick={() => handleOpenCompanyStudents(c.company_id, c.company_name)}
                        className="hover:bg-accent/40 cursor-pointer transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground flex items-center gap-2.5">
                          <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0">
                            {c.company_name.charAt(0)}
                          </div>
                          <div>
                            <div className="group-hover:text-primary transition-colors">{c.company_name}</div>
                            <div className="text-[10px] text-muted-foreground font-normal">{c.tier}</div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground">{c.industry}</td>
                        <td className="py-3.5 px-3 text-center font-medium">{c.students_applied}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 font-bold text-xs">
                            <Check className="h-3 w-3" />
                            {c.unique_students_placed}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-medium">{c.total_offers}</td>
                        <td className="py-3.5 px-3 font-semibold text-foreground">₹{c.average_package_lpa} LPA</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-600">₹{c.highest_package_lpa} LPA</td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:underline">
                            View Students <ChevronRight className="h-3 w-3" />
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No company placement records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY PLACEMENTS ("Which Students Were Placed at Which Company?") */}
      {activeTab === "companies" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                  <Building2 className="h-6 w-6 text-primary" />
                  Which Students Were Placed at Which Company?
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Institutional company-wise placement register. Click any company row to inspect the individual placed candidates.
                </p>
              </div>

              {/* Sorting and Export Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Sort:</span>
                  <select
                    value={companySortBy}
                    onChange={(e) => setCompanySortBy(e.target.value)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="unique_placed">Students Placed</option>
                    <option value="total_offers">Total Offers</option>
                    <option value="average_package">Average Package</option>
                    <option value="highest_package">Highest Package</option>
                    <option value="company_name">Company Name</option>
                  </select>
                </div>

                {!isStudent ? (
                  <a
                    href={getExportDownloadUrl("companies", academicYear === "All Batches" ? undefined : academicYear)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-accent/40 hover:bg-accent px-3 py-1.5 text-xs font-semibold transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-primary" />
                    Download Company Stats
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <Lock className="h-3 w-3" /> Export Admin Only
                  </span>
                )}
              </div>
            </div>

            {/* Comprehensive Company Table */}
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-3">Industry</th>
                    <th className="py-3 px-3">Recruitment Drive</th>
                    <th className="py-3 px-3 text-center">Applied</th>
                    <th className="py-3 px-3 text-center">Shortlisted</th>
                    <th className="py-3 px-3 text-center font-bold text-emerald-600 bg-emerald-500/5">
                      Unique Placed
                    </th>
                    <th className="py-3 px-3 text-center">Total Offers</th>
                    <th className="py-3 px-3">Avg Package</th>
                    <th className="py-3 px-3">Max Package</th>
                    <th className="py-3 px-3 text-center">Conversion</th>
                    <th className="py-3 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {companiesData && companiesData.items.length > 0 ? (
                    companiesData.items.map((c) => (
                      <tr
                        key={c.company_id}
                        onClick={() => handleOpenCompanyStudents(c.company_id, c.company_name)}
                        className="hover:bg-primary/5 cursor-pointer transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                              {c.company_name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold group-hover:text-primary transition-colors">{c.company_name}</div>
                              <span className="inline-block rounded-sm bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                                {c.tier}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground">{c.industry}</td>
                        <td className="py-3.5 px-3 text-muted-foreground max-w-[160px] truncate">
                          {c.recruitment_drive}
                        </td>
                        <td className="py-3.5 px-3 text-center font-medium">{c.students_applied}</td>
                        <td className="py-3.5 px-3 text-center font-medium">{c.students_shortlisted}</td>
                        <td className="py-3.5 px-3 text-center font-extrabold text-emerald-600 bg-emerald-500/5 text-sm">
                          {c.unique_students_placed}
                        </td>
                        <td className="py-3.5 px-3 text-center font-semibold text-foreground">
                          {c.total_offers}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-foreground">₹{c.average_package_lpa} LPA</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-600">₹{c.highest_package_lpa} LPA</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                            {c.conversion_rate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-accent">
                            <Eye className="h-3 w-3" /> View List
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-muted-foreground">
                        No company placement statistics found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {companiesData && companiesData.total_pages > 1 && (
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Showing page {companyPage} of {companiesData.total_pages} ({companiesData.total} total companies)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={companyPage <= 1}
                    onClick={() => setCompanyPage((p) => Math.max(1, p - 1))}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-40 hover:bg-accent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={companyPage >= companiesData.total_pages}
                    onClick={() => setCompanyPage((p) => p + 1)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-40 hover:bg-accent"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT DIRECTORY OR STUDENT SELF-STATUS */}
      {activeTab === "students" && (
        <div className="space-y-6">
          {isStudent ? (
            /* STUDENT VIEW: My Placement Status & Verified Offers */
            <div className="space-y-6">
              {/* Student Verified Profile & Placement Banner */}
              <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
                      SS
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-black text-foreground">Sindhuja Sankaramoorthy</h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Placed Candidate
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 px-2.5 py-0.5 text-xs font-bold">
                          <Sparkles className="h-3 w-3" /> 2 Verified Offers
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reg No: <span className="font-mono font-bold text-foreground">71812104042</span> • Department of Computer Science & Engineering • Batch 2022-2026 • CGPA: <span className="font-bold text-foreground">9.12</span>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-lg bg-accent px-2.5 py-1 text-muted-foreground">
                          Primary Offer: <strong className="text-foreground">Amazon (SDE-1)</strong>
                        </span>
                        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 font-bold text-emerald-600">
                          Package: ₹18.00 LPA (Super Dream Tier)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenStudentDetail(1)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Eye className="h-4 w-4" /> View Verified Offer Dossier
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified Offers Section */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Offer 1: Amazon */}
                <div className="rounded-3xl border-2 border-emerald-500/40 bg-card p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 rounded-bl-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="h-3 w-3" /> Primary Accepted Offer
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 font-black text-lg">
                      A
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Amazon Web Services</h3>
                      <p className="text-xs text-muted-foreground">Software Development Engineer I (SDE-1)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-border text-xs">
                    <div>
                      <span className="text-muted-foreground">Annual CTC</span>
                      <div className="text-xl font-black text-emerald-600 mt-0.5">₹18.00 LPA</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Offer Tier</span>
                      <div className="text-sm font-bold text-purple-600 mt-0.5">Super Dream Tier</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Offer Released</span>
                      <div className="font-semibold text-foreground mt-0.5">September 15, 2025</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Acceptance Verified</span>
                      <div className="font-semibold text-emerald-600 mt-0.5">September 18, 2025</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <ShieldCheck className="h-4 w-4" /> Verified by Placement Cell
                    </span>
                    <button
                      onClick={() => handleOpenStudentDetail(1)}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      Inspect Offer Details →
                    </button>
                  </div>
                </div>

                {/* Offer 2: TCS Digital */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 rounded-bl-2xl bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-wider px-3 py-1">
                    Backup Offer
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 font-black text-lg">
                      T
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Tata Consultancy Services</h3>
                      <p className="text-xs text-muted-foreground">Systems Engineer (TCS Digital)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-border text-xs">
                    <div>
                      <span className="text-muted-foreground">Annual CTC</span>
                      <div className="text-xl font-black text-foreground mt-0.5">₹7.50 LPA</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Offer Tier</span>
                      <div className="text-sm font-bold text-blue-600 mt-0.5">Tier 1 IT Core</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Offer Released</span>
                      <div className="font-semibold text-foreground mt-0.5">August 20, 2025</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Offer Status</span>
                      <div className="font-semibold text-blue-600 mt-0.5">Released / Retained</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Clock className="h-4 w-4" /> Eligible Backup Record
                    </span>
                    <button
                      onClick={() => handleOpenStudentDetail(1)}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      Inspect Offer Details →
                    </button>
                  </div>
                </div>
              </div>

              {/* Placement Drive Pipeline Stepper */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                <h3 className="text-base font-bold text-foreground mb-4">Placement Clearance & Onboarding Checklist</h3>
                <div className="grid gap-3 sm:grid-cols-4 text-xs">
                  {[
                    { step: "1. Assessment Round", status: "Cleared 100%", desc: "HackerRank & Cognitive Exam" },
                    { step: "2. Technical & HR", status: "Recommended", desc: "System Design & Leadership" },
                    { step: "3. Placement Review", status: "Offer Verified", desc: "Original LOI Approved" },
                    { step: "4. Semester NOC", status: "Ready for Release", desc: "Dean Academic Clearance" },
                  ].map((st, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-accent/20 p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-foreground">{st.step}</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="font-semibold text-emerald-600">{st.status}</div>
                      <p className="text-[11px] text-muted-foreground mt-1">{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Institutional Privacy & Peer Confidentiality Card */}
              <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-500" />
                    Institutional Peer Privacy Notice
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                    Under university placement policy, personal contact details, offer letters, and individual compensation packages of other students are confidential. Macro placement trends and company recruitment counts remain visible in the Overview and Company Recruits tabs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const u = switchRole("admin");
                    setCurrentUser(u);
                    toast.success("Switched to Placement Officer Admin Mode.");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  View Full 66-Student Register (Admin Mode)
                </button>
              </div>
            </div>
          ) : (
            /* ADMIN VIEW: Student Placement Register */
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
                    <Users className="h-6 w-6 text-primary" />
                    Student Placement Register
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Individual candidate records, multi-offer breakdown, departments, and verified offers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getExportDownloadUrl(
                      "students",
                      academicYear === "All Batches" ? undefined : academicYear,
                      selectedDept === "all" ? undefined : selectedDept,
                      selectedStatus === "all" ? undefined : selectedStatus
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-accent/40 hover:bg-accent px-3 py-1.5 text-xs font-semibold transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-primary" />
                    Export Filtered Register
                  </a>
                </div>
              </div>

              {/* Student Table */}
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-3">Reg Number</th>
                      <th className="py-3 px-3">Dept</th>
                      <th className="py-3 px-3">Batch</th>
                      <th className="py-3 px-3">Primary Company</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Package</th>
                      <th className="py-3 px-3 text-center">Offers</th>
                      <th className="py-3 px-3 text-center">Placement Status</th>
                      <th className="py-3 px-3 text-right">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {studentsData && studentsData.items.length > 0 ? (
                      studentsData.items.map((s) => (
                        <tr
                          key={s.student_id}
                          onClick={() => handleOpenStudentDetail(s.student_id)}
                          className="hover:bg-primary/5 cursor-pointer transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-semibold text-foreground">
                            <div className="group-hover:text-primary transition-colors font-bold">{s.name}</div>
                            <div className="text-[10px] text-muted-foreground">{s.email}</div>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-medium">{s.register_number}</td>
                          <td className="py-3.5 px-3">
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold">
                              {s.department_code}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-muted-foreground">{s.graduation_batch}</td>
                          <td className="py-3.5 px-3 font-medium">
                            {s.company_name ? (
                              <span className="text-foreground font-semibold">{s.company_name}</span>
                            ) : (
                              <span className="text-muted-foreground italic">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-muted-foreground max-w-[150px] truncate">
                            {s.job_role || "—"}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-emerald-600">
                            {s.package_lpa ? `₹${s.package_lpa} LPA` : "—"}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            {s.number_of_offers > 1 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 text-purple-600 px-2 py-0.5 text-[10px] font-bold">
                                <Sparkles className="h-2.5 w-2.5" />
                                {s.number_of_offers} offers
                              </span>
                            ) : s.number_of_offers === 1 ? (
                              <span className="rounded-full bg-blue-500/10 text-blue-600 px-2 py-0.5 text-[10px] font-semibold">
                                1 offer
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-[11px]">0</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                s.placement_status === "Placed"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : s.placement_status === "In Progress"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-slate-500/10 text-slate-500"
                              }`}
                            >
                              {s.placement_status === "Placed" && <CheckCircle2 className="h-3 w-3" />}
                              {s.placement_status === "In Progress" && <Clock className="h-3 w-3" />}
                              {s.placement_status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-accent">
                              View <ChevronRight className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-muted-foreground">
                          No students found matching your active filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {studentsData && studentsData.total_pages > 1 && (
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Showing page {studentPage} of {studentsData.total_pages} ({studentsData.total} matching students)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={studentPage <= 1}
                      onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-40 hover:bg-accent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      disabled={studentPage >= studentsData.total_pages}
                      onClick={() => setStudentPage((p) => p + 1)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-40 hover:bg-accent"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PLACEMENT ANALYTICS & CHARTS */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          {/* Top Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart 1: Department-wise Placement Rate */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="mb-4">
                <h3 className="text-base font-bold tracking-tight">Department-Wise Placement Performance</h3>
                <p className="text-xs text-muted-foreground">Eligible students vs Placed students and placement percentage</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.department_chart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="department_code" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-border bg-popover p-3 text-xs shadow-md space-y-1">
                              <div className="font-bold">{d.department}</div>
                              <div>Eligible: {d.eligible} students</div>
                              <div className="text-emerald-500 font-semibold">Placed: {d.placed} students</div>
                              <div className="text-primary font-bold">Placement Rate: {d.placement_percentage}%</div>
                              <div className="text-muted-foreground">Avg Package: ₹{d.avg_package} LPA</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="eligible" name="Eligible Students" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placed" name="Placed Students" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Package Distribution Histogram */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="mb-4">
                <h3 className="text-base font-bold tracking-tight">Salary Package Distribution (LPA)</h3>
                <p className="text-xs text-muted-foreground">Placement offers grouped by compensation brackets</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.package_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="bracket" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-border bg-popover p-2.5 text-xs shadow-md">
                              <div className="font-bold">{d.bracket}</div>
                              <div className="text-emerald-500 font-semibold">{d.count} offers issued</div>
                              <div className="text-muted-foreground">{d.percentage}% of total offers</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" name="Number of Offers" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Chart: Multi-Year Placement Trend */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-bold tracking-tight">Academic Year Multi-Year Trend</h3>
              <p className="text-xs text-muted-foreground">Historical trajectory of placement rate and average salary package</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.academic_year_trend} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPkg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="academic_year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-border bg-popover p-3 text-xs shadow-md space-y-1">
                            <div className="font-bold">Cohort: {d.academic_year}</div>
                            <div className="text-blue-500 font-semibold">Placement Rate: {d.placement_percentage}%</div>
                            <div className="text-emerald-500 font-semibold">Average Package: ₹{d.average_package} LPA</div>
                            <div className="text-muted-foreground">Total Offers: {d.total_offers}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area
                    type="monotone"
                    dataKey="placement_percentage"
                    name="Placement %"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRate)"
                  />
                  <Area
                    type="monotone"
                    dataKey="average_package"
                    name="Avg Package (LPA)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPkg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPORTS & EXPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          {isStudent ? (
            /* STUDENT VIEW: Restricted Reports */
            <div className="rounded-3xl border border-border bg-card p-8 shadow-xs max-w-2xl mx-auto text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black text-foreground">Placement Cell Authorization Required</h2>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-lg mx-auto">
                Raw cohort CSV exports, NAAC/NIRF compliance spreadsheets, and unmasked student contact registers are restricted to authorized university placement officers and department coordinators.
              </p>
              <div className="mt-5 p-3 rounded-xl bg-muted/50 border border-border text-xs text-left max-w-md mx-auto">
                <div className="font-semibold text-foreground">Current Active Session:</div>
                <div className="text-muted-foreground flex items-center justify-between mt-1">
                  <span>Sindhuja Sankaramoorthy</span>
                  <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Role: Student</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    const u = switchRole("admin");
                    setCurrentUser(u);
                    toast.success("Switched to Placement Officer Admin Mode.");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Log in as Placement Officer (Dr. K. Ramesh)
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-accent cursor-pointer"
                >
                  Back to Overview
                </button>
              </div>
            </div>
          ) : (
            /* ADMIN VIEW: Full Reports and CSV Downloads */
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
                Institutional Reports & Data Exports
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Download official CSV exports or print institutional reports for audits, NAAC/NIRF compliance, and placement board review.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Student Placement Register",
                    desc: "Complete roster of all students, contact details, companies placed, packages, and offer statuses.",
                    type: "students" as const,
                    icon: Users,
                    color: "text-blue-500",
                  },
                  {
                    title: "Company Placement Summary",
                    desc: "Comprehensive company-wise recruitment statistics, candidate counts, package ranges, and conversion rates.",
                    type: "companies" as const,
                    icon: Building2,
                    color: "text-emerald-500",
                  },
                  {
                    title: "Department Placement Audit",
                    desc: "Department-wise performance breakdown, eligible vs placed comparisons, and average packages.",
                    type: "departments" as const,
                    icon: GraduationCap,
                    color: "text-purple-500",
                  },
                ].map((rpt) => (
                  <div
                    key={rpt.type}
                    className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                        <rpt.icon className={`h-5 w-5 ${rpt.color}`} />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">{rpt.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rpt.desc}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-medium">Cohort: {academicYear}</span>
                      <a
                        href={getExportDownloadUrl(rpt.type, academicYear === "All Batches" ? undefined : academicYear)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Download className="h-3 w-3" /> Download CSV
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Print Friendly Report Section */}
              <div className="mt-8 rounded-2xl border border-border/80 bg-accent/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Printer className="h-4 w-4 text-primary" />
                    Print-Ready Placement Cell Board Report
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    Generates a clean, formatted executive summary designed for Dean and Governing Board presentation.
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Printer className="h-4 w-4" /> Print Placement Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SETTINGS & POLICY */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {isStudent ? (
            /* STUDENT VIEW: Restricted Settings */
            <div className="rounded-3xl border border-border bg-card p-8 shadow-xs max-w-2xl mx-auto text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black text-foreground">Placement Policy Controls Restricted</h2>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-lg mx-auto">
                Institutional counting rules, dream offer thresholds, and test data seeding are restricted to Placement Cell Administrators.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    const u = switchRole("admin");
                    setCurrentUser(u);
                    toast.success("Switched to Placement Officer Admin Mode.");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Log in as Placement Officer (Dr. K. Ramesh)
                </button>
              </div>
            </div>
          ) : (
            /* ADMIN VIEW: Settings Controls */
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs max-w-3xl">
              <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-6 w-6 text-primary" />
                Institutional Placement Policy & Settings
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Configure counting policies, dream offer rules, and database test seed utilities.
              </p>

              <div className="mt-6 space-y-5 divide-y divide-border text-xs">
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-foreground">Placement Counting Policy</div>
                    <div className="text-muted-foreground">
                      Define what qualifies a candidate as "Placed" in aggregate statistics
                    </div>
                  </div>
                  <select className="rounded-lg border border-border bg-background px-3 py-1.5 font-medium text-xs">
                    <option>Verified Offer (Offer Released / Accepted)</option>
                    <option>Offer Accepted Only</option>
                    <option>Selection Stage Confirmed</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-foreground">Dream Offer Policy Threshold</div>
                    <div className="text-muted-foreground">
                      Students with existing offers may interview for Dream / Super Dream tiers
                    </div>
                  </div>
                  <div className="font-bold text-primary">₹10.0+ LPA</div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-foreground">Demonstration Data Seeder</div>
                    <div className="text-muted-foreground">
                      Reset or re-seed institutional demo records with authentic multi-offer student scenarios
                    </div>
                  </div>
                  <button
                    onClick={handleReSeed}
                    className="rounded-xl border border-border bg-card hover:bg-accent px-3 py-1.5 text-xs font-semibold text-primary cursor-pointer"
                  >
                    Re-Seed Demo Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Company Placed Students Drawer / Modal */}
      {selectedCompanyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl border border-border bg-card p-6 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-black text-sm">
                  {companyDetail ? companyDetail.company_name.charAt(0) : "C"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {companyDetail ? companyDetail.company_name : "Company"} — Placed Students
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Exact list of students who secured placement offers at this organization
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCompanyId(null);
                  setCompanyDetail(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 flex-1 overflow-y-auto">
              {isLoadingCompanyStudents ? (
                <div className="py-12 flex flex-col items-center justify-center text-xs text-muted-foreground gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  Loading students placed at {companyDetail?.company_name}...
                </div>
              ) : companyDetail && companyDetail.students.length > 0 ? (
                <div className="space-y-4">
                  {isStudent && (
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs flex items-center gap-2.5 text-blue-300">
                      <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>
                        <strong>Student Confidentiality Mode:</strong> Peer names and registration numbers are anonymized to protect candidate privacy. Verified package figures and hiring volumes are accurate.
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>
                      Total Selected Candidates:{" "}
                      <strong className="text-foreground">{companyDetail.students.length} students</strong>
                    </span>
                    <span>Cohort: {academicYear}</span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Reg No</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3">Role</th>
                          <th className="py-2.5 px-3">Package (LPA)</th>
                          <th className="py-2.5 px-3">Selection Date</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {companyDetail.students.map((st) => (
                          <tr key={st.student_id} className="hover:bg-accent/40">
                            <td className="py-3 px-3 font-bold text-foreground">
                              {st.name}
                              <div className="text-[10px] text-muted-foreground font-normal">{st.email}</div>
                            </td>
                            <td className="py-3 px-3 font-mono font-medium">{st.register_number}</td>
                            <td className="py-3 px-3">
                              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold">
                                {st.department_code}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-medium text-foreground">{st.role}</td>
                            <td className="py-3 px-3 font-bold text-emerald-600">₹{st.package_lpa} LPA</td>
                            <td className="py-3 px-3 text-muted-foreground">{st.selection_date || "—"}</td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  st.is_accepted
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                    : "bg-blue-500/10 text-blue-600"
                                }`}
                              >
                                {st.is_accepted && <Check className="h-3 w-3" />}
                                {st.offer_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No students recorded for this company in the selected cohort.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 border-t border-border pt-3 flex justify-end">
              <button
                onClick={() => {
                  setSelectedCompanyId(null);
                  setCompanyDetail(null);
                }}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Student Profile Detail Modal */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl border border-border bg-card p-6 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm">
                  {studentDetail ? studentDetail.name.charAt(0) : "S"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {studentDetail ? studentDetail.name : "Student Profile"}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{studentDetail?.register_number}</span>
                    <span>•</span>
                    <span>{studentDetail?.department}</span>
                    <span>•</span>
                    <span>CGPA: {studentDetail?.cgpa}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedStudentId(null);
                  setStudentDetail(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-4">
              {isLoadingStudentDetail ? (
                <div className="py-12 flex flex-col items-center justify-center text-xs text-muted-foreground gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  Loading candidate placement profile...
                </div>
              ) : studentDetail ? (
                <>
                  {/* Summary Banner */}
                  <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-accent/20 p-3 text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">Placement Status</div>
                      <div className="font-bold text-emerald-600 mt-0.5">{studentDetail.placement_status}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">Total Offers</div>
                      <div className="font-bold text-primary mt-0.5">{studentDetail.offers_count} offers</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">Highest Package</div>
                      <div className="font-bold text-emerald-600 mt-0.5">
                        {studentDetail.highest_package_lpa ? `₹${studentDetail.highest_package_lpa} LPA` : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Offers List */}
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-primary" /> Verified Placement Offers
                    </h4>
                    {studentDetail.offers.length > 0 ? (
                      <div className="space-y-2">
                        {studentDetail.offers.map((off) => (
                          <div
                            key={off.id}
                            className={`rounded-2xl border p-3 text-xs flex items-center justify-between ${
                              off.is_accepted
                                ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                                : "border-border bg-card"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">{off.company_name}</span>
                                {off.is_accepted && (
                                  <span className="rounded-full bg-emerald-500/20 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">
                                    Accepted Offer
                                  </span>
                                )}
                              </div>
                              <div className="text-muted-foreground">{off.role}</div>
                              <div className="text-[10px] text-muted-foreground mt-1">Date: {off.offer_date}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-base font-black text-emerald-600">₹{off.package_lpa} LPA</div>
                              <span className="text-[10px] font-semibold text-muted-foreground">{off.offer_status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                        No verified placement offers released yet.
                      </div>
                    )}
                  </div>

                  {/* Application Pipeline History */}
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-primary" /> Application History
                    </h4>
                    <div className="space-y-2">
                      {studentDetail.applications.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-xl border border-border bg-card p-2.5 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-foreground">{app.company_name}</span>
                            <span className="text-muted-foreground"> — {app.role}</span>
                          </div>
                          <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold text-primary">
                            {app.stage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 border-t border-border pt-3 flex justify-end">
              <button
                onClick={() => {
                  setSelectedStudentId(null);
                  setStudentDetail(null);
                }}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminPlacementsDashboard;
