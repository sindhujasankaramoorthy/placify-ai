import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Lock,
  KeyRound,
  IdCard
} from "lucide-react";
import { toast } from "sonner";
import { PRESET_STUDENT_USER, setActiveUser } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Student Login — Placify AI" },
      { name: "description", content: "Login to Placify AI for student placement insights and career tracking." },
      { property: "og:title", content: "Student Login — Placify AI" },
      { property: "og:description", content: "Sign in with your student credentials." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  // Student Form State
  const [studentRegisterNo, setStudentRegisterNo] = useState("71812104042");
  const [studentEmail, setStudentEmail] = useState("sindhujas24cs@srishakthi.ac.in");
  const [studentPassword, setStudentPassword] = useState("student123");
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setActiveUser(PRESET_STUDENT_USER);
      toast.success(`Logged in as ${PRESET_STUDENT_USER.name} (Student Mode)`);
      navigate({ to: "/dashboard/admin/placements" });
    }, 300);
  };

  return (
    <div className="min-h-screen pb-16 font-sans">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />

        <section className="mx-auto mt-10 max-w-lg">
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
          </div>
        </section>
      </div>
    </div>
  );
}
