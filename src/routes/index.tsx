import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Sparkles, Briefcase, FileText, Search, TrendingUp,
  ClipboardList, MessageSquare, CheckCircle2, Zap, ShieldCheck, Star
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import heroImg from "@/assets/hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Placify AI — AI-Powered Placement & Resume Assistant" },
      { name: "description", content: "Discover jobs, optimize resumes, and track placements with AI. Built for students." },
      { property: "og:title", content: "Placify AI — AI-Powered Placement & Resume Assistant" },
      { property: "og:description", content: "Discover jobs, optimize resumes, and track placements with AI." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Briefcase, title: "AI Job Matching", desc: "Find roles that fit your skills, profile, and goals with intelligent matching." },
  { icon: FileText, title: "ATS Resume Builder", desc: "Generate ATS-friendly resumes crafted for recruiters and screening bots." },
  { icon: Search, title: "Resume Analyzer", desc: "Compare your resume against any job description and get a fit score." },
  { icon: TrendingUp, title: "Skill Gap Analysis", desc: "Discover missing skills and get a personalized learning roadmap." },
  { icon: ClipboardList, title: "Application Tracker", desc: "Kanban-style board to track every application from applied to offer." },
  { icon: MessageSquare, title: "Interview Prep", desc: "AI mock interviews, aptitude drills and feedback that actually helps." },
];

const stats = [
  { value: "12k+", label: "Students placed" },
  { value: "98%", label: "ATS pass rate" },
  { value: "2.4×", label: "Faster interviews" },
  { value: "500+", label: "Hiring partners" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />

        {/* Hero */}
        <section className="relative mt-10 grid gap-10 md:mt-16 md:grid-cols-2 md:items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Placement Assistant · v2.0
            </div>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-gradient">Placify AI</span>
              <span className="mt-2 block text-3xl font-bold text-foreground md:text-4xl">
                Land your dream role, faster.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              AI-powered placement & resume assistant. Helping students discover the right
              opportunities, optimize resumes, and track placement progress — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold btn-gradient">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/features" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent">
                Explore Features
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> ATS-optimized</span>
              <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Real-time matching</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Privacy-first</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[image:var(--gradient-soft)] blur-2xl" />
            <div className="rounded-3xl p-2 glass">
              <img
                src={heroImg}
                width={1280}
                height={1024}
                alt="Student using Placify AI"
                className="w-full animate-float rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl p-4 glass-strong">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Resume Score</div>
                  <div className="text-lg font-bold">92/100</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 rounded-2xl p-4 glass-strong">
              <div className="text-xs text-muted-foreground">New match</div>
              <div className="mt-1 text-sm font-semibold">Google · SDE Intern</div>
              <div className="text-xs text-primary">96% fit</div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl p-6 glass text-center">
              <div className="text-3xl font-extrabold text-gradient">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Features */}
        <section id="features" className="mt-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything you need to get hired</h2>
            <p className="mt-3 text-muted-foreground">Purpose-built AI for placements — from resume to offer letter.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl p-6 glass transition-transform hover:-translate-y-1">
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand shadow-[0_10px_30px_-10px] shadow-primary/50">
                  <f.icon className="h-6 w-6 text-white" strokeWidth={2.25} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24">
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-16">
            <div className="absolute inset-0 -z-10 gradient-brand" />
            <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />
            <div className="max-w-2xl text-white">
              <h2 className="text-3xl font-bold md:text-4xl">Ready to accelerate your placement journey?</h2>
              <p className="mt-3 text-white/85">Join thousands of students who landed offers with Placify AI.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-white/90">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/dashboard" className="inline-flex items-center rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
                  View Demo Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
