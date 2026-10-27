import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, KeyRound, Building, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PRESET_ADMIN_USER, setActiveUser } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Placement Cell Admin Login — Placify AI" },
      { name: "description", content: "Secure portal for university placement officers and administrators." },
      { property: "og:title", content: "Placement Cell Admin Login — Placify AI" },
      { property: "og:description", content: "Administrative authentication for Training and Placement Cell." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [officerEmail, setOfficerEmail] = useState("placement.officer@srishakthi.ac.in");
  const [securityPasskey, setSecurityPasskey] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setActiveUser(PRESET_ADMIN_USER);
      toast.success(`Authenticated as ${PRESET_ADMIN_USER.name} (Head of Placements)`);
      navigate({ to: "/dashboard/admin/placements" });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-sans">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />

        <section className="mx-auto mt-10 max-w-md pb-16">
          {/* Institutional Badge */}
          <div className="mb-4 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              Institutional Administrative Gateway
            </span>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Placement Cell Officer Portal</h1>
                <p className="text-xs text-slate-400">Sri Shakthi Institute of Engineering & Technology</p>
              </div>
            </div>

            {/* Quick 1-Click Officer Access Card */}
            <div className="mt-5 rounded-2xl border border-blue-500/30 bg-blue-950/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-300">Authorized Demo Account</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">Dr. K. Ramesh</div>
                  <div className="text-[11px] text-slate-400">Head of Training & Placements</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdminLogin()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Quick Sign In <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[10px] text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Full 66-Student Register
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> CSV Data Exports
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Policy Controls
                </span>
              </div>
            </div>

            {/* Manual Form Divider */}
            <div className="my-5 flex items-center gap-3 text-xs text-slate-500">
              <span className="h-px flex-1 bg-slate-800" />
              <span>or sign in with officer credentials</span>
              <span className="h-px flex-1 bg-slate-800" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-blue-400" /> Officer Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={officerEmail}
                  onChange={(e) => setOfficerEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
                  placeholder="placement.officer@srishakthi.ac.in"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-blue-400" /> Security Passkey / Passcode
                </label>
                <input
                  type="password"
                  required
                  value={securityPasskey}
                  onChange={(e) => setSecurityPasskey(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-400">
                  <Lock className="h-3 w-3" /> 256-bit Secure Session
                </span>
                <span className="text-[11px] text-slate-500">Sri Shakthi Auth v2.4</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Authenticating Officer..." : "Sign In to Placement Administration"}
              </button>
            </form>

            {/* Switch to Student Login */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Are you a student or candidate looking for placement insights?
              </p>
              <Link
                to="/login"
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Go to Student Login Portal →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
