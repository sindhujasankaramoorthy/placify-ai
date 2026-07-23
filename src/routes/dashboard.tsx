import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Briefcase, FileText, Search, ClipboardList, TrendingUp,
  Bell, Settings, User, Sparkles, Menu, X, LogOut
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Placify AI" },
      { name: "description", content: "Your personal placement command center." },
      { property: "og:title", content: "Dashboard — Placify AI" },
      { property: "og:description", content: "Track applications, resumes, and skills." },
    ],
  }),
  component: DashboardLayout,
});

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/jobs", label: "Recommended Jobs", icon: Briefcase },
  { to: "/dashboard/resume", label: "Resume", icon: FileText },
  { to: "/dashboard/analyzer", label: "Resume Analyzer", icon: Search },
  { to: "/dashboard/applications", label: "Applications", icon: ClipboardList },
  { to: "/dashboard/skills", label: "Skill Tracker", icon: TrendingUp },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform p-4 transition-transform md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col rounded-3xl p-4 glass-strong">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand">
                  <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
                </span>
                <span className="text-base font-bold">Placify<span className="text-gradient"> AI</span></span>
              </Link>
              <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent md:hidden" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
              {nav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to as never}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "gradient-brand text-white shadow-[0_10px_30px_-12px] shadow-primary/60"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 rounded-2xl border border-border p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-bold text-white">S</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">Sindhuja</div>
                  <div className="truncate text-xs text-muted-foreground">Final year · CSE</div>
                </div>
                <Link to="/login" className="ml-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-accent" aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

        {/* Main */}
        <main className="min-w-0 flex-1">
          <header className="mb-6 flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-border md:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="ml-auto flex items-center gap-2">
              <Link to="/dashboard/notifications" className="grid h-10 w-10 place-items-center rounded-xl border border-border hover:bg-accent" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Link>
              <Link to="/dashboard/profile" className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-bold text-white">S</Link>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
