import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Award, FolderGit2, Pencil } from "lucide-react";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Placify AI" },
      { name: "description", content: "Your student profile: skills, projects, certifications." },
      { property: "og:title", content: "Profile — Placify AI" },
      { property: "og:description", content: "Your placement profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-6 glass md:p-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="grid h-24 w-24 place-items-center rounded-3xl gradient-brand text-3xl font-extrabold text-white">S</div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">Sindhuja</h1>
            <p className="text-sm text-muted-foreground">Final year · B.Tech Computer Science</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> ABC Institute of Technology</span>
              <span>CGPA: <b className="text-foreground">8.9</b></span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold btn-gradient">
            <Pencil className="h-4 w-4" /> Edit Profile
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["React", "TypeScript", "Node", "Python", "SQL", "AWS", "Docker", "TailwindCSS"].map((s) => (
              <span key={s} className="rounded-full border border-border bg-card px-3 py-1 text-xs">{s}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 glass lg:col-span-2">
          <h3 className="font-semibold flex items-center gap-2"><FolderGit2 className="h-4 w-4 text-primary" /> Projects</h3>
          <ul className="mt-3 space-y-3">
            {[
              { t: "Placify AI Dashboard", d: "React + Recharts placement analytics tool." },
              { t: "Campus Alerts Bot", d: "Telegram bot for deadline & interview alerts." },
              { t: "Resume Ranker", d: "NLP model to score resumes vs job descriptions." },
            ].map((p) => (
              <li key={p.t} className="rounded-xl border border-border p-3">
                <div className="text-sm font-semibold">{p.t}</div>
                <div className="text-xs text-muted-foreground">{p.d}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-6 glass lg:col-span-3">
          <h3 className="font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Certifications</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {["AWS Cloud Practitioner", "Meta Frontend Developer", "Google Data Analytics"].map((c) => (
              <div key={c} className="rounded-xl border border-border bg-card p-4 text-sm">{c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
