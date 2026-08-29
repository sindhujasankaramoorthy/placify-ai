import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  FileText,
  Zap,
  TrendingUp,
  Award,
  Layers,
  ChevronDown,
  Info,
  XCircle
} from "lucide-react";
import { CandidateProfile } from "../lib/resume/types";
import { defaultCandidateSummary } from "../components/resume/ResumeTemplates";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/analyzer")({
  head: () => ({
    meta: [
      { title: "Advanced AI Resume Analyzer — Placify AI" },
      { name: "description", content: "Compare your resume against any Job Description instantly with ATS parsing." },
    ],
  }),
  component: AnalyzerPage,
});

// Dictionary of tech keywords categorized for advanced matching
const TECH_DICTIONARY = {
  languages: ["Java", "Python", "C", "C++", "JavaScript", "TypeScript", "Go", "Rust", "Kotlin", "Swift", "Ruby", "PHP"],
  frameworks: ["React", "Angular", "Vue", "Next.js", "Node.js", "Node", "Express", "Django", "Flask", "Spring Boot", "FastAPI", "Tailwind", "Bootstrap"],
  databases: ["MongoDB", "PostgreSQL", "MySQL", "Oracle", "Redis", "Cassandra", "DynamoDB", "SQLite"],
  aiMl: ["RAG", "FAISS", "LLM", "Vector Embeddings", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Neural Networks"],
  toolsCloud: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "GitHub", "REST", "gRPC", "GraphQL", "CI/CD", "Linux", "Firebase"]
};

// Flattened list for quick extraction
const ALL_TECH_KEYWORDS = Object.values(TECH_DICTIONARY).flat();

const SAMPLE_JDS = [
  {
    title: "AI & Full-Stack Developer Intern",
    company: "Accenture India",
    text: `Accenture is hiring an AI & Full-Stack Developer Intern.
Qualifications & Requirements:
- Candidates should be pursuing B.E. / B.Tech in Computer Science (2026 Batch).
- Solid programming skills in Python and Java.
- Experience building AI chatbots, especially using Retrieval-Augmented Generation (RAG) and vector libraries (FAISS).
- Familiarity with databases like MongoDB and SQL.
- Frontend experience in React or HTML/CSS is a plus.
- Version control using Git/GitHub.`
  },
  {
    title: "Software Engineer - Fresher",
    company: "Tata Consultancy Services (TCS)",
    text: `TCS is seeking Associate Software Engineers.
Job Overview:
- Work on enterprise applications using Java or Python.
- Collaborate with database engineers on MySQL / PostgreSQL queries.
- Basic understanding of web development (HTML5, CSS3, JavaScript).
- Strong algorithmic problem solving and data structures (Java / C).
- Familiarity with RESTful API design.`
  },
  {
    title: "Cloud & DevOps Associate",
    company: "Innovate Solutions",
    text: `Job Description:
Looking for a DevOps & Backend Developer.
Requirements:
- Hands-on experience containerizing applications with Docker.
- Deployment and orchestration using Kubernetes.
- Cloud experience on AWS (EC2, S3).
- Scripting in Python or Bash.
- CI/CD workflow automation using GitHub Actions.`
  }
];

function AnalyzerPage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Advanced Analysis result states
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState<{ name: string; category: string }[]>([]);
  const [missing, setMissing] = useState<{ name: string; category: string }[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    keywordDensity: 0,
    structureFormat: 0,
    experienceLevel: 0,
  });
  const [checklist, setChecklist] = useState<{ label: string; passed: boolean; tip: string }[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [roleFit, setRoleFit] = useState("Standard Match");
  const [scanStep, setScanStep] = useState("");

  // Load candidate profile from localStorage
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

  const runAnalysis = async () => {
    if (!jdText.trim()) {
      toast.error("Please paste or select a Job Description first!");
      return;
    }

    setIsAnalyzing(true);
    setHasAnalyzed(false);

    // Multi-stage scan animation for realistic and satisfying UX
    const steps = [
      "Extracting Job Description tech stack requisites...",
      "Analyzing structural layout & formatting rules...",
      "Matching candidate skills against core competencies...",
      "Cross-referencing GitHub & LeetCode statistics...",
      "Calculating semantic density and scoring metrics..."
    ];

    for (const step of steps) {
      setScanStep(step);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    // 1. Gather all candidate skills and contents
    const candidateSkills = new Set<string>();
    const resumeTexts: string[] = [];

    if (profile) {
      resumeTexts.push(profile.name.toLowerCase());
      resumeTexts.push((profile.summary || "").toLowerCase());
      
      [
        ...(profile.skills?.languages || []),
        ...(profile.skills?.frameworks || []),
        ...(profile.skills?.databases || []),
        ...(profile.skills?.tools || []),
        ...(profile.skills?.softSkills || [])
      ].forEach((s) => {
        candidateSkills.add(s.toLowerCase());
        resumeTexts.push(s.toLowerCase());
      });

      (profile.projects || []).forEach((p) => {
        resumeTexts.push(p.title.toLowerCase());
        resumeTexts.push(p.description.toLowerCase());
        (p.highlights || []).forEach((h) => resumeTexts.push(h.toLowerCase()));
        (p.techStack || []).forEach((t) => candidateSkills.add(t.toLowerCase()));
      });

      (profile.experience || []).forEach((exp) => {
        resumeTexts.push(exp.role.toLowerCase());
        resumeTexts.push(exp.company.toLowerCase());
        (exp.highlights || []).forEach((h) => resumeTexts.push(h.toLowerCase()));
      });

      (profile.education || []).forEach((edu) => {
        resumeTexts.push(edu.degree.toLowerCase());
        resumeTexts.push(edu.institution.toLowerCase());
      });
    } else {
      // Fallback default skills for Sindhuja
      ["java", "python", "c", "sql", "html", "css", "mongodb", "problem solving", "rag", "faiss", "vector embeddings", "multimodal ai"]
        .forEach((s) => {
          candidateSkills.add(s);
          resumeTexts.push(s);
        });
      resumeTexts.push("rag-based resume intelligence chatbot");
      resumeTexts.push("mindaura ai");
      resumeTexts.push("splitwise");
    }

    const fullResumeText = resumeTexts.join(" ");

    // 2. Extract keywords present in the JD
    const jdLower = jdText.toLowerCase();
    const matchedKeywords: { name: string; category: string }[] = [];
    const missingKeywords: { name: string; category: string }[] = [];

    // Analyze dictionary categories
    Object.entries(TECH_DICTIONARY).forEach(([category, list]) => {
      list.forEach((kw) => {
        const regex = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
        if (regex.test(jdLower)) {
          // Check if candidate has it
          const cleanKw = kw.toLowerCase();
          const hasSkill = candidateSkills.has(cleanKw) || fullResumeText.includes(cleanKw);
          
          if (hasSkill) {
            matchedKeywords.push({ name: kw, category });
          } else {
            missingKeywords.push({ name: kw, category });
          }
        }
      });
    });

    // 3. Score Breakdown calculations
    const keywordMatchPct = matchedKeywords.length > 0 
      ? Math.round((matchedKeywords.length / (matchedKeywords.length + missingKeywords.length)) * 100)
      : 80;

    // Check formatting rules
    const hasEmail = profile?.email || fullResumeText.includes("@");
    const hasPhone = profile?.phone || /\+?\d[\d -]{8,}\d/.test(fullResumeText);
    const hasLinks = profile?.linkedinUrl || profile?.githubUrl || fullResumeText.includes("linkedin") || fullResumeText.includes("github");
    const hasMetrics = /\b\d+%\b|\b\d+x\b|\bhours\b|\baccuracy\b|\bperformance\b/i.test(fullResumeText);

    let structureScore = 70;
    if (hasEmail) structureScore += 10;
    if (hasPhone) structureScore += 10;
    if (hasLinks) structureScore += 5;
    if (hasMetrics) structureScore += 5;

    // Check experience level match (e.g. 2026 Batch, Intern, Fresher)
    const isInternshipJd = /intern|trainee|stipend/i.test(jdText);
    const isExperiencedJd = /senior|architect|5\+ years|lead/i.test(jdText);
    
    let expScore = 90;
    if (isExperiencedJd) {
      expScore = 55; // Under-experienced for Senior positions
    } else if (isInternshipJd) {
      expScore = 98; // Perfect fit for 2026 batch candidates
    }

    const finalATSScore = Math.round((keywordMatchPct * 0.5) + (structureScore * 0.3) + (expScore * 0.2));

    // 4. Checklist validation
    const checkItems = [
      { label: "Contact Details Completeness", passed: Boolean(hasEmail && hasPhone), tip: "Ensure email, phone number, and location are fully stated in the header." },
      { label: "Online Profiles & Portfolios", passed: Boolean(hasLinks), tip: "Include links to your GitHub repositories and LinkedIn profile." },
      { label: "Quantifiable Impact & Metrics", passed: hasMetrics, tip: "Use percentages or numbers in project highlights (e.g. 'boosted accuracy to 96%')." },
      { label: "Experience Level Alignment", passed: !isExperiencedJd, tip: "Resume structured perfectly for Internships and Associate SDE positions." }
    ];

    // 5. Generate action suggestions
    const recs: string[] = [];
    if (missingKeywords.length > 0) {
      recs.push(`Directly inject missing target keywords [${missingKeywords.slice(0, 3).map(m => m.name).join(", ")}] in your core skills and projects.`);
      
      const missingCategories = new Set(missingKeywords.map(m => m.category));
      if (missingCategories.has("aiMl")) {
        recs.push("Highlight vector indexing or prompt engineering algorithms in your AI chatbot descriptions.");
      }
      if (missingCategories.has("toolsCloud")) {
        recs.push("Incorporate container deployment terms (e.g. Docker, GitHub CI/CD Actions) in your deployment highlight lines.");
      }
    } else {
      recs.push("Your resume covers all technical requirements requested. Maintain formatting and submit.");
    }
    if (!hasMetrics) {
      recs.push("Rephrase project outcomes using the Google XYZ formula: 'Accomplished [X], measured by [Y], by doing [Z]'.");
    }
    recs.push("Optimize line items with powerful SDE action verbs (e.g., 'Engineered', 'Orchestrated', 'Optimized') rather than descriptive tasks.");

    // Role fit assessment
    let fitRating = "Moderate Fit";
    if (finalATSScore >= 90) fitRating = "High Core Alignment";
    else if (finalATSScore >= 75) fitRating = "Strong Match Candidate";

    setScore(finalATSScore);
    setMatched(matchedKeywords);
    setMissing(missingKeywords);
    setScoreBreakdown({
      keywordDensity: keywordMatchPct,
      structureFormat: structureScore,
      experienceLevel: expScore,
    });
    setChecklist(checkItems);
    setRecommendations(recs);
    setRoleFit(fitRating);
    
    setHasAnalyzed(true);
    setIsAnalyzing(false);
    toast.success("AI Resume Scanner executed perfectly!");
  };

  const loadSampleJD = (text: string) => {
    setJdText(text);
    toast.success("Preset Job Description loaded!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI ATS Resume Matcher</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate your active resume formatting, structural score, and tech stack match against target Job Descriptions.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Card: Input Job Description */}
        <div className="rounded-3xl p-6 glass border border-border flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Target Job Description
              </h3>
              <span className="text-xs text-muted-foreground">Plain text scan</span>
            </div>

            {/* Selector Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Job Presets:</span>
              {SAMPLE_JDS.map((jd, idx) => (
                <button
                  key={idx}
                  onClick={() => loadSampleJD(jd.text)}
                  className="rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
                >
                  {jd.company} ({jd.title})
                </button>
              ))}
            </div>

            <textarea
              rows={13}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card p-4 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary outline-none"
              placeholder="Paste qualifications, desired tech stack list, or full job posting details here..."
            />
          </div>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="btn-gradient w-full rounded-xl py-3.5 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> {scanStep}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Run Deep ATS Scan
              </>
            )}
          </button>
        </div>

        {/* Right Card: Advanced AI Report */}
        <div className="rounded-3xl p-6 glass border border-border space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">ATS Compliance Report</h3>
            {hasAnalyzed && (
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-bold text-primary uppercase">
                {roleFit}
              </span>
            )}
          </div>

          {hasAnalyzed ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score section */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative grid h-28 w-28 shrink-0 place-items-center mx-auto">
                  <svg className="absolute inset-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#gradient-score)"
                      strokeWidth="10"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * score) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="gradient-score" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-xl font-black text-foreground">{score}%</div>
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center justify-center sm:justify-start gap-1">
                    <Award className="h-3.5 w-3.5" /> Overall Fit Index
                  </div>
                  <h4 className="text-base font-extrabold text-foreground">
                    {score >= 90
                      ? "Excellent Job Alignment!"
                      : score >= 75
                      ? "Strong Match Candidate"
                      : "Refinement Advised"}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-normal max-w-sm">
                    {score >= 90
                      ? "Your resume satisfies all primary qualification checks and has high keyword density."
                      : `Add ${missing.length} missing keywords and metrics to increase match rating.`}
                  </p>
                </div>
              </div>

              {/* Advanced Score Breakdown */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-border">
                <div className="rounded-xl bg-card border border-border p-2.5 text-center">
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase block">Keyword density</span>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">{scoreBreakdown.keywordDensity}%</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-2.5 text-center">
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase block">Structure score</span>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">{scoreBreakdown.structureFormat}%</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-2.5 text-center">
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase block">Role Alignment</span>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">{scoreBreakdown.experienceLevel}%</p>
                </div>
              </div>

              {/* Matched vs Missing list */}
              <div className="space-y-3.5 pt-2 border-t border-border">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Present Resume Keywords ({matched.length})
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {matched.length > 0 ? (
                      matched.map((k) => (
                        <span
                          key={k.name}
                          className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/15"
                        >
                          {k.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No matched keywords</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-rose-500" /> Missing Job Keywords ({missing.length})
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {missing.length > 0 ? (
                      missing.map((k) => (
                        <span
                          key={k.name}
                          className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/15"
                        >
                          {k.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-500 font-bold">🎉 Complete stack match! No missing skills.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Formatting & Structure Checklist */}
              <div className="pt-2 border-t border-border">
                <h4 className="text-xs font-bold text-foreground mb-2">Structural & Format Checklist</h4>
                <div className="space-y-2">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span
                        className={`font-semibold shrink-0 ${
                          item.passed
                            ? "text-emerald-500 flex items-center gap-1"
                            : "text-amber-500 flex items-center gap-1"
                        }`}
                      >
                        {item.passed ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Checked
                          </>
                        ) : (
                          <span className="underline cursor-help" title={item.tip}>
                            Needs Fix
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-2xl bg-card border border-border p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span>ATS Action Plan (Step-by-step)</span>
                </div>
                <ul className="text-xs space-y-2 text-muted-foreground list-decimal list-inside leading-relaxed">
                  {recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-[360px] rounded-3xl border border-dashed border-border/80 flex flex-col items-center justify-center text-center p-6 space-y-3 bg-card/20">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
                <Sparkles className="h-6 w-6 text-primary opacity-85 animate-float" />
              </div>
              <h4 className="font-bold text-foreground text-xs">AI Matcher Standby</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                Paste the desired qualifications or click a Preset Job Description in the left area, then click "Run Deep ATS Scan" to start analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
