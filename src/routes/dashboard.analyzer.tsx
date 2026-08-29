import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, RefreshCw, FileText, Zap } from "lucide-react";
import { CandidateProfile } from "../lib/resume/types";
import { defaultCandidateSummary } from "../components/resume/ResumeTemplates";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/analyzer")({
  head: () => ({
    meta: [
      { title: "AI Resume Analyzer — Placify AI" },
      { name: "description", content: "Compare your resume against any Job Description instantly." },
    ],
  }),
  component: AnalyzerPage,
});

// A robust dictionary of tech keywords for ATS matching
const TECH_KEYWORDS = [
  "Java", "Python", "C", "C++", "JavaScript", "TypeScript", "Go", "Rust", "Kotlin", "Swift",
  "HTML", "CSS", "SQL", "MongoDB", "PostgreSQL", "MySQL", "Oracle", "Redis", "Cassandra",
  "React", "Angular", "Vue", "Next.js", "Node.js", "Node", "Express", "Django", "Flask", "Spring Boot",
  "RAG", "FAISS", "LLM", "Vector Embeddings", "Machine Learning", "Deep Learning", "NLP",
  "AWS", "Azure", "Docker", "Kubernetes", "Git", "GitHub", "REST", "gRPC", "GraphQL",
  "Microservices", "CI/CD", "Tailwind", "Bootstrap", "Linux", "Firebase"
];

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: "AI & Full-Stack Developer Intern",
    company: "Accenture",
    text: `Position: AI Intern
Skills Required:
- Proficiency in Python, JavaScript, and React.
- Hands-on experience with Retrieval-Augmented Generation (RAG) and LLM orchestration.
- Familiarity with vector databases, semantic search indexes (FAISS/Pinecone), and SQL.
- Strong problem-solving skills and clean Git practices.`
  },
  {
    title: "Associate Software Engineer",
    company: "TCS",
    text: `Job Description:
We are seeking an Associate Software Engineer with strong foundations in:
- Object Oriented Programming (Java/C++).
- Database systems (SQL, MySQL, MongoDB).
- Basic web styling (HTML, CSS) and REST APIs.
- Collaborative development using Git/GitHub.`
  },
  {
    title: "Backend Cloud Developer",
    company: "Innovate Labs",
    text: `Role Overview:
Join our backend systems division.
Requirements:
- Strong programming in Python, Java, or Go.
- Experience building RESTful microservices.
- Cloud deployment knowledge on AWS, Docker containers, and Kubernetes.
- Databases: PostgreSQL, MongoDB, Redis.`
  }
];

function AnalyzerPage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Analysis result state
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Load candidate profile from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("placify_candidate_profile");
        if (saved) {
          setProfile(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load candidate profile", e);
      }
    }
  }, []);

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      toast.error("Please paste or select a Job Description first!");
      return;
    }

    setIsAnalyzing(true);
    toast.loading("AI ATS Scanner parsing Job Description & Resume...");

    setTimeout(() => {
      // 1. Gather candidate skills
      const candidateSkills = new Set<string>();
      if (profile?.skills) {
        [
          ...(profile.skills.languages || []),
          ...(profile.skills.frameworks || []),
          ...(profile.skills.databases || []),
          ...(profile.skills.tools || []),
          ...(profile.skills.softSkills || [])
        ].forEach((s) => candidateSkills.add(s.toLowerCase()));
      } else {
        // Fallback default skills (Sindhuja's profile)
        ["java", "python", "c", "sql", "html", "css", "mongodb", "problem solving", "rag", "faiss", "vector embeddings"]
          .forEach((s) => candidateSkills.add(s));
      }

      // 2. Extract keywords from Job Description text
      const jdLower = jdText.toLowerCase();
      const jdKeywords = TECH_KEYWORDS.filter((kw) => {
        // Match word boundaries to prevent substring collisions (e.g. C in React)
        const regex = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
        return regex.test(jdLower);
      });

      // 3. Compare and score
      const matchDetails: string[] = [];
      const missingDetails: string[] = [];

      jdKeywords.forEach((kw) => {
        if (candidateSkills.has(kw.toLowerCase())) {
          matchDetails.push(kw);
        } else {
          missingDetails.push(kw);
        }
      });

      // Calculate score
      let finalScore = 70; // Base score
      if (jdKeywords.length > 0) {
        finalScore = Math.round((matchDetails.length / jdKeywords.length) * 100);
        // Add soft-caps for realistic metrics
        finalScore = Math.max(25, Math.min(100, finalScore));
      } else {
        finalScore = 85; // Default standard fit
      }

      // 4. Generate actionable advice
      const recs: string[] = [];
      if (missingDetails.length > 0) {
        recs.push(`Integrate the missing skills [${missingDetails.slice(0, 3).join(", ")}] directly into your core technical skills list.`);
        if (missingDetails.includes("Docker") || missingDetails.includes("Kubernetes") || missingDetails.includes("AWS")) {
          recs.push("Add a project highlighting deployment, containerization, or cloud architecture to satisfy backend/ops keywords.");
        }
        if (missingDetails.includes("React") || missingDetails.includes("Next.js") || missingDetails.includes("TypeScript")) {
          recs.push("Describe the frontend framework / UI libraries used in your chatbot or AI project to demonstrate interface styling.");
        }
      } else {
        recs.push("Your resume matches this Job Description perfectly! Customize the layout style and apply immediately.");
      }
      recs.push("Enhance bullet points with action verbs (e.g. 'Engineered', 'Optimized', 'Deployed') rather than passive tasks.");

      setScore(finalScore);
      setMatched(matchDetails);
      setMissing(missingDetails);
      setRecommendations(recs);
      setHasAnalyzed(true);
      setIsAnalyzing(false);

      toast.dismiss();
      toast.success(`Analysis Complete! Fit Score: ${finalScore}%`);
    }, 1200);
  };

  const handleSelectSample = (sampleText: string) => {
    setJdText(sampleText);
    toast.success("Loaded sample Job Description!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Resume Analyzer & JD Matcher</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Compare your active profile (ATS standard) against any Job Description to scan for missing keywords and optimize compliance.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Job Description Input */}
        <div className="rounded-3xl p-6 glass border border-border flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Target Job Description (JD)</h3>
              <span className="text-xs text-muted-foreground">Paste plain text</span>
            </div>

            {/* Quick Sample Selector Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">Presets:</span>
              {SAMPLE_JOB_DESCRIPTIONS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample.text)}
                  className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                >
                  {sample.company} ({sample.title})
                </button>
              ))}
            </div>

            <textarea
              rows={12}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary outline-none"
              placeholder="Paste the target job description or copy/paste key qualification bullet points here..."
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-gradient w-full rounded-xl py-3 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Scanning Resume & JD...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Run AI ATS Analysis
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis Report */}
        <div className="rounded-3xl p-6 glass border border-border space-y-5">
          <h3 className="font-bold text-sm text-foreground">AI ATS Compliance Report</h3>

          {hasAnalyzed ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Score indicator */}
              <div className="flex items-center gap-6">
                <div className="relative grid h-28 w-28 place-items-center">
                  <svg className="absolute inset-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="9" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#gradient-score)"
                      strokeWidth="9"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * score) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-500 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient-score" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-xl font-black text-foreground">{score}%</div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-xs uppercase tracking-wider text-primary">ATS Score Rating</div>
                  <h4 className="text-base font-extrabold text-foreground">
                    {score >= 90
                      ? "Excellent Job Description Alignment!"
                      : score >= 75
                      ? "Good Match with minor gaps"
                      : "Moderate Match (Refinement advised)"}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-normal">
                    {score >= 90
                      ? "Your profile matches all key technical requirements perfectly."
                      : `Add ${missing.length} missing keywords to reach a 90+ score.`}
                  </p>
                </div>
              </div>

              {/* Keyword distribution */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div>
                  <div className="text-xs font-bold text-foreground">Matched JD Keywords ({matched.length})</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {matched.length > 0 ? (
                      matched.map((k) => (
                        <span
                          key={k}
                          className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" /> {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No matching keywords found</span>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-bold text-foreground">Missing JD Keywords ({missing.length})</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {missing.length > 0 ? (
                      missing.map((k) => (
                        <span
                          key={k}
                          className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20 inline-flex items-center gap-1"
                        >
                          <AlertTriangle className="h-3 w-3" /> {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground font-semibold text-emerald-500">
                        🎉 Perfect score! No missing keywords
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action items */}
              <div className="rounded-2xl bg-card border border-border p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span>AI Tailoring Action Plan</span>
                </div>
                <ul className="text-xs space-y-2 text-muted-foreground list-decimal list-inside leading-relaxed">
                  {recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-[300px] rounded-2xl border border-dashed border-border/80 flex flex-col items-center justify-center text-center p-6 space-y-3 bg-card/20">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
                <FileText className="h-6 w-6 opacity-75" />
              </div>
              <h4 className="font-bold text-foreground text-xs">Ready for Scan</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                Paste any internship or placement job description in the left editor and click "Run AI ATS Analysis" to evaluate candidate alignment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
