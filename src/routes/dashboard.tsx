import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Briefcase, FileText, Search, ClipboardList, TrendingUp,
  Bell, Settings, User, Sparkles, Menu, X, LogOut, Wand2, ShieldCheck
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

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; badge?: string }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/admin/placements", label: "Placement Cell Admin", icon: ShieldCheck, badge: "Admin" },
  { to: "/dashboard/jobs", label: "Recommended Jobs", icon: Briefcase },
  { to: "/dashboard/personalizer", label: "Resume Personalizer", icon: Wand2 },
  { to: "/dashboard/resume", label: "Resume", icon: FileText },
  { to: "/dashboard/analyzer", label: "Resume Analyzer", icon: Search },
  { to: "/dashboard/applications", label: "Applications", icon: ClipboardList },
  { to: "/dashboard/skills", label: "Skill Tracker", icon: TrendingUp },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];


import { getActiveUser, switchRole, onAuthChange, PlacifyUser } from "@/lib/auth";
import { toast } from "sonner";

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<PlacifyUser>(getActiveUser());
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setUser(getActiveUser());
    const unsub = onAuthChange((u) => setUser(u));
    return unsub;
  }, []);

  const handleToggleRole = () => {
    const nextRole = user.role === "admin" ? "student" : "admin";
    const newUser = switchRole(nextRole);
    setUser(newUser);
    toast.success(`Switched mode to: ${newUser.role === "admin" ? "Placement Cell Administrator" : "Student View"}`);
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    {
      to: "/dashboard/admin/placements",
      label: user.role === "admin" ? "Placement Cell Admin" : "Placement Insights",
      icon: user.role === "admin" ? ShieldCheck : TrendingUp,
      badge: user.role === "admin" ? "Admin" : "Student",
    },
    { to: "/dashboard/jobs", label: "Recommended Jobs", icon: Briefcase },
    { to: "/dashboard/personalizer", label: "Resume Personalizer", icon: Wand2 },
    { to: "/dashboard/resume", label: "Resume", icon: FileText },
    { to: "/dashboard/analyzer", label: "Resume Analyzer", icon: Search },
    { to: "/dashboard/applications", label: "Applications", icon: ClipboardList },
    { to: "/dashboard/skills", label: "Skill Tracker", icon: TrendingUp },
    { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { to: "/dashboard/profile", label: "Profile", icon: User },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

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
              {navItems.map((item) => {
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
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        active
                          ? "bg-white/25 text-white"
                          : item.badge === "Admin"
                          ? "bg-blue-500/15 text-blue-500 border border-blue-500/20"
                          : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Profile Card with Quick Role Switcher */}
            <div className="mt-4 rounded-2xl border border-border bg-card/60 p-3">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white shrink-0 ${
                  user.role === "admin" ? "bg-blue-600" : "gradient-brand"
                }`}>
                  {user.avatarLetter}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold flex items-center gap-1.5">
                    {user.name.split(" ")[0]}
                    <span className={`rounded-sm px-1 py-0.2 text-[9px] font-extrabold uppercase ${
                      user.role === "admin"
                        ? "bg-blue-500/20 text-blue-600"
                        : "bg-emerald-500/20 text-emerald-600"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">{user.title}</div>
                </div>
                <Link to="/login" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground shrink-0" aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Link>
              </div>

              {/* Role Toggle Switch */}
              <button
                onClick={handleToggleRole}
                className="mt-2.5 w-full rounded-xl border border-border bg-accent/30 hover:bg-accent/70 py-1.5 px-2 text-[10px] font-semibold text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Switch to {user.role === "admin" ? "Student View" : "Admin View"}</span>
              </button>
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
              <button
                onClick={handleToggleRole}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-accent px-3 py-1.5 text-xs font-medium cursor-pointer"
              >
                <span className="text-muted-foreground">Mode:</span>
                <span className={`font-bold ${user.role === "admin" ? "text-blue-500" : "text-emerald-500"}`}>
                  {user.role === "admin" ? "Placement Admin" : "Student"}
                </span>
                <span className="text-[10px] text-primary underline ml-1">Switch</span>
              </button>
              <Link to="/dashboard/notifications" className="grid h-10 w-10 place-items-center rounded-xl border border-border hover:bg-accent" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Link>
              <Link to="/dashboard/profile" className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-bold text-white">
                {user.avatarLetter}
              </Link>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

