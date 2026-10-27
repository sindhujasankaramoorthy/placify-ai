import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Sparkles, ShieldCheck, GraduationCap, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
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
      { name: "description", content: "Login to Placify AI to access placement analytics and candidate profiles." },
      { property: "og:title", content: "Login — Placify AI" },
      { property: "og:description", content: "Sign in with your placement administrator or student account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("placement.officer@srishakthi.ac.in");
  const [password, setPassword] = useState("••••••••");

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "admin") {
      setEmail("placement.officer@srishakthi.ac.in");
    } else {
      setEmail("sindhujas24cs@srishakthi.ac.in");
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = role === "admin" ? PRESET_ADMIN_USER : PRESET_STUDENT_USER;
    setActiveUser(user);
    toast.success(`Logged in as ${user.name} (${user.role === "admin" ? "Placement Officer" : "Student"})`);
    navigate({ to: "/dashboard/admin/placements" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdmin = selectedRole === "admin" || email.toLowerCase().includes("admin") || email.toLowerCase().includes("officer");
    const user = isAdmin ? PRESET_ADMIN_USER : PRESET_STUDENT_USER;
    setActiveUser(user);
    toast.success(`Welcome back, ${user.name}!`);
    navigate({ to: "/dashboard/admin/placements" });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />
        <section className="mx-auto mt-12 max-w-lg">
          <div className="rounded-3xl p-8 glass-strong border border-border shadow-2xl">
            {/* Brand Logo & Header */}
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Placement Portal Login</h1>
                <p className="text-xs text-muted-foreground">Select your institutional role to continue</p>
              </div>
            </div>

            {/* Quick 1-Click Role Login Cards */}
            <div className="mt-6 space-y-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Your Role (1-Click Demo Login)
              </span>

              {/* 1. Placement Cell Admin */}
              <div
                onClick={() => handleQuickLogin("admin")}
                className={`group cursor-pointer rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                  selectedRole === "admin"
                    ? "border-blue-500 bg-blue-500/10 shadow-md ring-2 ring-blue-500/20"
                    : "border-border bg-card hover:border-blue-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white font-bold">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        Placement Cell Administrator
                        <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                          Full Access
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Dr. K. Ramesh • Head of Placements</div>
                    </div>
                  </div>
                  <button className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors">
                    Login <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground border-t border-border/50 pt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Full Student Register
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> CSV Data Exports
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> All Company Rosters
                  </span>
                </div>
              </div>

              {/* 2. Student Login */}
              <div
                onClick={() => handleQuickLogin("student")}
                className={`group cursor-pointer rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                  selectedRole === "student"
                    ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20"
                    : "border-border bg-card hover:border-emerald-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white font-bold">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        Student / Candidate
                        <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                          Partial Insights
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Sindhuja Sankaramoorthy • Final Year CSE</div>
                    </div>
                  </div>
                  <button className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors">
                    Login <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground border-t border-border/50 pt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Placement Benchmarks
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Recruiter Trends & Packages
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    🔒 Peer Info Anonymized
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Form Login */}
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>or sign in with credentials</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  College Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="name@srishakthi.ac.in"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl px-4 py-2.5 text-xs font-bold btn-gradient cursor-pointer shadow-md"
              >
                Sign In to Dashboard
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              New here? <Link to="/signup" className="font-semibold text-primary hover:underline">Create account</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
