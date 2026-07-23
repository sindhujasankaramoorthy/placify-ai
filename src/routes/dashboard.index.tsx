import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase, FileCheck2, CalendarCheck, Star, TrendingUp, ArrowUpRight,
  Building2, Clock, Bell
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid
} from "recharts";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Placify AI" },
      { name: "description", content: "Your placement stats, applications and recommendations." },
      { property: "og:title", content: "Dashboard — Placify AI" },
      { property: "og:description", content: "Track your progress toward placement." },
    ],
  }),
  component: DashboardHome,
});

const stats = [
  { label: "Jobs Recommended", value: 48, delta: "+12", icon: Briefcase },
  { label: "Applications Sent", value: 17, delta: "+3", icon: FileCheck2 },
  { label: "Interviews", value: 5, delta: "+2", icon: CalendarCheck },
  { label: "Resume Score", value: "92", delta: "+8", icon: Star },
];

const weekly = [
  { d: "Mon", v: 2 }, { d: "Tue", v: 4 }, { d: "Wed", v: 3 },
  { d: "Thu", v: 6 }, { d: "Fri", v: 5 }, { d: "Sat", v: 8 }, { d: "Sun", v: 7 },
];

const skills = [
  { s: "React", v: 92 }, { s: "Node", v: 78 }, { s: "SQL", v: 85 },
  { s: "Python", v: 70 }, { s: "System Design", v: 55 }, { s: "DSA", v: 88 },
];

const activity = [
  { t: "Applied to Google · SDE Intern", when: "2h ago" },
  { t: "Resume updated · v4", when: "Yesterday" },
  { t: "Shortlisted at Razorpay", when: "2 days ago" },
  { t: "Completed React skill test", when: "3 days ago" },
];

const deadlines = [
  { c: "Microsoft", role: "SWE Intern", due: "Nov 28" },
  { c: "Amazon", role: "SDE-1", due: "Dec 02" },
  { c: "Flipkart", role: "APM", due: "Dec 05" },
];

const companies = ["Google", "Microsoft", "Amazon", "Meta", "Stripe", "Razorpay"];

function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8">
        <div className="absolute inset-0 -z-10 gradient-brand opacity-95" />
        <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_80%_10%,white,transparent_40%)]" />
        <div className="text-white">
          <div className="text-sm/6 opacity-80">Welcome back,</div>
          <h1 className="text-3xl font-bold md:text-4xl">Sindhuja 👋</h1>
          <p className="mt-1 max-w-lg text-white/85">You have 3 new job matches and 2 upcoming deadlines this week.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
            <Bell className="h-4 w-4" /> 3 new notifications
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-5 glass">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand">
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <ArrowUpRight className="h-3 w-3" /> {s.delta}
              </span>
            </div>
            <div className="mt-4 text-3xl font-extrabold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl p-6 glass">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Weekly Applications</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.22 265)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.55 0.24 300)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.22 265)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl p-6 glass">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Skill Match %</h3>
              <p className="text-xs text-muted-foreground">Top target roles</p>
            </div>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skills}>
                <CartesianGrid strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="s" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Bar dataKey="v" fill="oklch(0.55 0.24 300)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl p-6 glass lg:col-span-2">
          <h3 className="font-semibold">Recent Activity</h3>
          <ul className="mt-4 space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="text-sm">{a.t}</div>
                  <div className="text-xs text-muted-foreground">{a.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Upcoming Deadlines</h3>
          <ul className="mt-4 space-y-3">
            {deadlines.map((d) => (
              <li key={d.c} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <div className="text-sm font-medium">{d.c}</div>
                  <div className="text-xs text-muted-foreground">{d.role}</div>
                </div>
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">{d.due}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl p-6 glass">
        <h3 className="font-semibold">Recommended Companies</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {companies.map((c) => (
            <span key={c} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
              <Building2 className="h-3.5 w-3.5 text-primary" /> {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
