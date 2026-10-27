import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import {
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building,
  KeyRound,
  IdCard,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import {
  PRESET_ADMIN_USER,
  PRESET_STUDENT_USER,
  setActiveUser,
  UserRole
} from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Placify AI" },
      { name: "description", content: "Login to Placify AI for student placement insights or placement cell administration." },
      { property: "og:title", content: "Login — Placify AI" },
      { property: "og:description", content: "Sign in with your student or placement administrator account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  // Role portal tab: 'student' or 'admin'
  const [activePortal, setActivePortal] = useState<UserRole>("student");

  // Student Form State
  const [studentRegisterNo, setStudentRegisterNo] = useState("71812104042");
  const [studentEmail, setStudentEmail] = useState("sindhujas24cs@srishakthi.ac.in");
  const [studentPassword, setStudentPassword] = useState("student123");

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState("placement.officer@srishakthi.ac.in");
  const [adminPasskey, setAdminPasskey] = useState("admin123");

  const [isLoading, setIsLoading] = useState(false);

  // Read URL search params on mount if ?portal=admin or ?portal=student
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const portalParam = params.get("portal") || params.get("role");
      if (portalParam === "admin") {
        setActivePortal("admin");
      } else if (portalParam === "student") {
        setActivePortal("student");
      }
    }
  }, []);

  const handleStudentLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setActiveUser(PRESET_STUDENT_USER);
      toast.success(`Logged in as ${PRESET_STUDENT_USER.name} (Student Mode)`);
      navigate({ to: "/dashboard/admin/placements" });
    }, 300);
  };

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setActiveUser(PRESET_ADMIN_USER);
      toast.success(`Logged in as ${PRESET_ADMIN_USER.name} (Head of Placements)`);
      navigate({ to: "/dashboard/admin/placements" });
    }, 300);
  };

  return (
    <div className="min-h-screen pb-16 font-sans">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />

        <section className="mx-auto mt-8 max-w-lg">
          {/* Top Portal Switcher Tabs */}
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-muted/60 p-1.5 border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setActivePortal("student")}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all cursor-pointer ${
                activePortal === "student"
                  ? "bg-card text-emerald-600 shadow-md border border-emerald-500/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className={`h-4 w-4 ${activePortal === "student" ? "text-emerald-500" : ""}`} />
              <span>Student Login Portal</span>
              {activePortal === "student" && (
                <span className="hidden sm:inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600">
                  Partial View
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActivePortal("admin")}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all cursor-pointer ${
                activePortal === "admin"
                  ? "bg-slate-900 text-white shadow-md border border-blue-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className={`h-4 w-4 ${activePortal === "admin" ? "text-blue-400" : ""}`} />
              <span>Placement Officer Portal</span>
              {activePortal === "admin" && (
                <span className="hidden sm:inline-block rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-blue-300">
                  Full Access
                </span>
              )}
            </button>
          </div>

          {/* PORTAL 1: STUDENT LOGIN */}
          {activePortal === "student" && (
            <div className="rounded-3xl p-8 glass-strong border border-emerald-500/20 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-emerald-500/10 border-b border-l border-emerald-500/20 px-3 py-1 text-[10px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> Candidate Gateway
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-foreground">Student Placement Login</h1>
                  <p className="text-xs text-muted-foreground">Sri Shakthi Institute of Engineering & Technology</p>
                </div>
              </div>

              {/* 1-Click Quick Demo Sign In Card for Student */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-white font-bold text-xs">
                      SS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">Sindhuja Sankaramoorthy</div>
                      <div className="text-[11px] text-muted-foreground">Final Year CSE • Reg: 71812104042</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStudentLogin()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    1-Click Login <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Campus Macro Statistics
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Recruiter Salary Trends
                  </span>
                  <span className="flex items-center gap-1 text-purple-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> My Verified Amazon Offer
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>or enter student credentials</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              {/* Student Form */}
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <IdCard className="h-3.5 w-3.5 text-emerald-500" /> Student Register No / Roll No
                  </label>
                  <input
                    type="text"
                    required
                    value={studentRegisterNo}
                    onChange={(e) => setStudentRegisterNo(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="71812104042"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-500" /> College Email ID
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="sindhujas24cs@srishakthi.ac.in"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-emerald-500" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Student Privacy Mode:</strong> Institutional macro trends and your own offers are visible. Peer student personal data is protected.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Sign In to Student Placement Portal"}
                </button>
              </form>

              {/* Admin Portal Link */}
              <div className="mt-6 pt-4 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Are you a Placement Cell Coordinator or Faculty Admin?
                </p>
                <Link
                  to="/admin/login"
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Go to Placement Cell Admin Portal →
                </Link>
              </div>
            </div>
          )}

          {/* PORTAL 2: PLACEMENT CELL ADMIN LOGIN */}
          {activePortal === "admin" && (
            <div className="rounded-3xl p-8 bg-slate-900 border border-blue-500/30 text-white shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-blue-500/20 border-b border-l border-blue-500/30 px-3 py-1 text-[10px] font-black text-blue-300 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Full Institutional Admin
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-white">Placement Cell Officer Login</h1>
                  <p className="text-xs text-slate-400">Sri Shakthi Institute of Engineering & Technology</p>
                </div>
              </div>

              {/* 1-Click Quick Demo Sign In Card for Admin */}
              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/40 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white font-bold text-xs">
                      KR
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Dr. K. Ramesh</div>
                      <div className="text-[11px] text-slate-400">Head of Training & Placements</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdminLogin()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    1-Click Login <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-2 text-[10px] text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Full 66-Student Register
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> CSV Data Exports
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Policy Controls
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
                <span className="h-px flex-1 bg-slate-800" />
                <span>or enter officer passkey</span>
                <span className="h-px flex-1 bg-slate-800" />
              </div>

              {/* Admin Form */}
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-blue-400" /> Officer Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
                    placeholder="placement.officer@srishakthi.ac.in"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-blue-400" /> Administrative Passkey
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPasskey}
                    onChange={(e) => setAdminPasskey(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-400">
                    <Lock className="h-3 w-3" /> Full Administrative Clearance
                  </span>
                  <Link to="/admin/login" className="text-[11px] text-blue-400 hover:underline">
                    Direct Admin URL →
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Sign In to Placement Administration"}
                </button>
              </form>

              {/* Student Portal Link */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  Are you a student looking for placement insights?
                </p>
                <button
                  type="button"
                  onClick={() => setActivePortal("student")}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                >
                  Go to Student Login Portal →
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
