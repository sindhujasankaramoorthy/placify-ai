import React, { useRef, useState } from "react";
import { Search, Filter, Upload, FileSpreadsheet, Building2, MapPin, Calendar, ExternalLink, Sparkles, CheckCircle, ArrowRight, Tag } from "lucide-react";
import { CandidateProfile, ConnectedProfiles, JobOpportunity } from "../../lib/resume/types";
import { parseJobsExcelFile, sampleJobsDataset } from "../../lib/resume/excelParser";
import { analyzeJobMatch } from "../../lib/resume/tailorEngine";

interface JobDirectorySectionProps {
  jobs: JobOpportunity[];
  profile: CandidateProfile;
  connected: ConnectedProfiles;
  onUpdateJobs: (jobs: JobOpportunity[]) => void;
  onSelectJobForAnalysis: (job: JobOpportunity) => void;
  onSelectJobForTailoring: (job: JobOpportunity) => void;
}

export const JobDirectorySection: React.FC<JobDirectorySectionProps> = ({
  jobs,
  profile,
  connected,
  onUpdateJobs,
  onSelectJobForAnalysis,
  onSelectJobForTailoring,
}) => {
  const excelInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("all");

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const parsedJobs = await parseJobsExcelFile(e.target.files[0]);
      onUpdateJobs(parsedJobs);
    }
  };

  // Compute live match scores for jobs
  const processedJobs = (jobs || []).map((job) => {
    const match = analyzeJobMatch(profile, connected, job);
    return {
      ...job,
      matchScore: match.overallMatchScore,
    };
  });

  // Extract unique locations & skills for filter dropdowns
  const uniqueLocations = Array.from(new Set(processedJobs.map((j) => j.location || "Coimbatore")));
  const uniqueSkills = Array.from(new Set(processedJobs.flatMap((j) => j.skills || [])));

  // Filter jobs by search term, location, and skill
  const filteredJobs = processedJobs.filter((job) => {
    const matchesSearch =
      (job.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skills || []).some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLoc = selectedLocation === "all" || (job.location || "").includes(selectedLocation);
    const matchesSkill = selectedSkillFilter === "all" || (job.skills || []).includes(selectedSkillFilter);

    return matchesSearch && matchesLoc && matchesSkill;
  });

  return (
    <div className="space-y-6">
      {/* Header & Excel Upload Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Internship & Placement Opportunities Directory</h2>
          <p className="text-sm text-muted-foreground">
            Import Excel campus sheets or select a placement opportunity to run deep ATS JD analysis and AI resume tailoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={excelInputRef}
            onChange={handleExcelUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />
          <button
            onClick={() => excelInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold hover:bg-accent shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Upload Job Excel Sheet
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass rounded-2xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Company, Role (e.g. AI Intern, ABC Technologies, FastAPI)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Skill:</span>
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none"
            >
              <option value="all">All Skills</option>
              {uniqueSkills.slice(0, 10).map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => {
          const score = job.matchScore || 75;
          const isHighMatch = score >= 80;

          return (
            <div
              key={job.id}
              className="glass rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 hover:border-primary/50 hover:shadow-glow group"
            >
              <div>
                {/* Company & Match Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary font-bold">
                      {job.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{job.role}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                        isHighMatch
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      <Sparkles className="h-3 w-3" /> {score}% Match
                    </div>
                  </div>
                </div>

                {/* Location & Eligibility */}
                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-foreground shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-foreground shrink-0" />
                    <span>Apply by: {job.deadline}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">Key Skills Required:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectJobForAnalysis(job)}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-accent"
                >
                  View Job Analysis
                </button>
                <button
                  onClick={() => onSelectJobForTailoring(job)}
                  className="btn-gradient inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold shadow-md"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Tailor Resume
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="glass rounded-3xl p-12 text-center space-y-3">
          <p className="text-lg font-bold">No jobs matching your filter parameters.</p>
          <p className="text-sm text-muted-foreground">Try clearing search filters or uploading a new placement Excel sheet.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedLocation("all");
              setSelectedSkillFilter("all");
            }}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
