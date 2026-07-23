import { createFileRoute } from "@tanstack/react-router";
import { Upload, Sparkles, Download, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/resume")({
  head: () => ({
    meta: [
      { title: "Resume Builder — Placify AI" },
      { name: "description", content: "Generate ATS-friendly resumes with AI." },
      { property: "og:title", content: "Resume Builder — Placify AI" },
      { property: "og:description", content: "Build ATS-ready resumes." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
        <p className="mt-1 text-muted-foreground">Upload or generate an ATS-friendly resume in seconds.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl p-6 glass lg:col-span-2 space-y-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-10 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand"><Upload className="h-6 w-6 text-white" /></div>
            <h3 className="mt-4 font-semibold">Upload your resume</h3>
            <p className="text-sm text-muted-foreground">PDF, DOCX up to 5MB</p>
            <button className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">Choose file</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold btn-gradient">
              <Sparkles className="h-4 w-4" /> Generate AI Resume
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-accent">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-6 glass">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><FileText className="h-4 w-4" /> ATS Score</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="text-5xl font-extrabold text-gradient">92</div>
            <div className="mb-2 text-sm text-muted-foreground">/ 100</div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full gradient-brand" style={{ width: "92%" }} />
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Strong action verbs</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Quantified impact</li>
            <li className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-destructive" /> Missing keyword: “Kubernetes”</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Keyword Suggestions</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Docker", "Kubernetes", "GraphQL", "CI/CD", "REST APIs", "Redis", "Microservices"].map((k) => (
              <span key={k} className="rounded-full border border-border bg-card px-3 py-1 text-xs">{k}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Missing Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {["System Design", "AWS Certified", "Advanced SQL"].map((k) => (
              <span key={k} className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">{k}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 glass">
        <h3 className="font-semibold">Preview</h3>
        <div className="mt-4 aspect-[3/4] max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="text-xl font-bold">Sindhuja</div>
          <div className="text-sm text-muted-foreground">Final-year CSE · sindhuja@college.edu · +91 90000 00000</div>
          <hr className="my-4 border-border" />
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Summary</div>
          <p className="mt-1 text-sm">CS student passionate about building AI products. React, Node, Python.</p>
          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">Experience</div>
          <p className="mt-1 text-sm">Frontend Intern · Acme (2024). Shipped 3 features improving retention 18%.</p>
          <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">Skills</div>
          <p className="mt-1 text-sm">React, TypeScript, Node, Python, SQL, TailwindCSS, Docker</p>
        </div>
      </div>
    </div>
  );
}
