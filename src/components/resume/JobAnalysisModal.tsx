import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, Building2, MapPin, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react";
import { CandidateProfile, ConnectedProfiles, JobOpportunity } from "../../lib/resume/types";
import { analyzeJobMatch } from "../../lib/resume/tailorEngine";

interface JobAnalysisModalProps {
  job: JobOpportunity;
  profile: CandidateProfile;
  connected: ConnectedProfiles;
  onClose: () => void;
  onStartTailoring: () => void;
}

export const JobAnalysisModal: React.FC<JobAnalysisModalProps> = ({
  job,
  profile,
  connected,
  onClose,
  onStartTailoring,
}) => {
  const analysis = analyzeJobMatch(profile, connected, job);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-extrabold text-primary">
                Job Description Analysis
              </span>
              <span className="text-xs text-muted-foreground">• {job.company}</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">{job.role}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <Building2 className="h-3.5 w-3.5" /> {job.company} — <MapPin className="h-3.5 w-3.5" /> {job.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Top Score Matrix Dashboard */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Main Overall Match Dial */}
          <div className="glass-strong rounded-2xl p-4 flex flex-col items-center justify-center text-center lg:col-span-1 border-2 border-primary/30">
            <div className="text-xs font-semibold text-muted-foreground">Overall Resume Match</div>
            <div className="mt-2 text-4xl font-black text-gradient">{analysis.overallMatchScore}%</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full gradient-brand transition-all duration-500"
                style={{ width: `${analysis.overallMatchScore}%` }}
              />
            </div>
          </div>

          {/* Metric Cards */}
          <div className="rounded-2xl border border-border bg-card/50 p-4">
            <div className="text-xs font-semibold text-muted-foreground">Skills Match</div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{analysis.skillsMatchScore}%</div>
            <div className="mt-2 text-[11px] text-muted-foreground">Matched {analysis.matchedSkills.length} of {job.skills.length} core skills</div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-4">
            <div className="text-xs font-semibold text-muted-foreground">Project Match</div>
            <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{analysis.projectMatchScore}%</div>
            <div className="mt-2 text-[11px] text-muted-foreground">GitHub & portfolio project alignment</div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-4">
            <div className="text-xs font-semibold text-muted-foreground">Experience Match</div>
            <div className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.experienceMatchScore}%</div>
            <div className="mt-2 text-[11px] text-muted-foreground">Internship and leadership history</div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-4">
            <div className="text-xs font-semibold text-muted-foreground">Keyword Match</div>
            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{analysis.keywordMatchScore}%</div>
            <div className="mt-2 text-[11px] text-muted-foreground">ATS scanner keyword density</div>
          </div>
        </div>

        {/* Skills Breakdown Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Matched Skills */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Matched Skills ({analysis.matchedSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.matchedSkills.map((s) => (
                <span key={s} className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  ✓ {s}
                </span>
              ))}
              {analysis.matchedSkills.length === 0 && <p className="text-xs text-muted-foreground">No exact skill matches.</p>}
            </div>
          </div>

          {/* Partial Match */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" /> Partial Match ({analysis.partialSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.partialSkills.map((s) => (
                <span key={s} className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  ⚠ {s}
                </span>
              ))}
              {analysis.partialSkills.length === 0 && <p className="text-xs text-muted-foreground">No partial matches.</p>}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-rose-600 dark:text-rose-400">
              <XCircle className="h-4 w-4" /> Missing Skills / Gaps ({analysis.missingSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.missingSkills.map((s) => (
                <span key={s} className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
                  ✕ {s}
                </span>
              ))}
              {analysis.missingSkills.length === 0 && <p className="text-xs text-muted-foreground">No missing skills detected!</p>}
            </div>
          </div>
        </div>

        {/* Detailed Job Description & Tailoring Recommendations */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Extract Job Description */}
          <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Extracted Job Requirements</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{job.jobDescription}</p>
          </div>

          {/* Anti-Fabrication Guarantee & Recommendations */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <ShieldCheck className="h-4 w-4" /> Anti-Fabrication AI Guarantee
            </div>
            <ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
              {analysis.tailoringRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Official Apply Link
          </a>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl border border-border px-5 py-2.5 text-xs font-semibold hover:bg-accent"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartTailoring();
              }}
              className="btn-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold shadow-md"
            >
              <Sparkles className="h-4 w-4" /> Generate AI Tailored Resume <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
