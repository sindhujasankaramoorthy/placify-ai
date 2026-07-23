import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import {
  Briefcase, FileText, Search, TrendingUp, ClipboardList, MessageSquare,
  Bell, User, BarChart3, Sparkles
} from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Placify AI" },
      { name: "description", content: "Explore Placify AI features: job matching, ATS resume builder, analyzer, tracker and more." },
      { property: "og:title", content: "Features — Placify AI" },
      { property: "og:description", content: "AI-powered placement tools built for students." },
    ],
  }),
  component: FeaturesPage,
});

const features = [
  { icon: Briefcase, title: "AI Job Matching", desc: "Find jobs based on your skills, profile and goals." },
  { icon: FileText, title: "ATS Resume Builder", desc: "Generate ATS-friendly resumes tailored to each role." },
  { icon: Search, title: "Resume Analyzer", desc: "Compare your resume with any job description." },
  { icon: TrendingUp, title: "Skill Gap Analysis", desc: "See missing skills and a learning roadmap." },
  { icon: ClipboardList, title: "Application Tracker", desc: "Kanban board across every stage of hiring." },
  { icon: MessageSquare, title: "Interview Preparation", desc: "Mock interviews and aptitude questions." },
  { icon: Bell, title: "Smart Notifications", desc: "Deadlines, interview alerts and updates." },
  { icon: BarChart3, title: "Analytics", desc: "Weekly progress, skill match and resume score." },
  { icon: User, title: "Rich Profile", desc: "Projects, certifications, CGPA and more." },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />
        <section className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Features
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            One platform. <span className="text-gradient">Every placement tool.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything students need to land offers, in a single AI-powered workspace.
          </p>
        </section>
        <section className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl p-6 glass transition-transform hover:-translate-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand">
                <f.icon className="h-6 w-6 text-white" strokeWidth={2.25} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
        <Footer />
      </div>
    </div>
  );
}
