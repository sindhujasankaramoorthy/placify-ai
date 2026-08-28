import React, { useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  RefreshCw,
  Edit3,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  Trash2,
  FileUp,
  AlertCircle
} from "lucide-react";
import { BaseResume, CandidateProfile } from "../../lib/resume/types";
import { parseResumeFile } from "../../lib/resume/parser";
import { toast } from "sonner";

interface ResumeUploadSectionProps {
  baseResume: BaseResume | null;
  profile: CandidateProfile | null;
  onUpdateResume: (resume: BaseResume, profile: CandidateProfile) => void;
  onUpdateProfile: (profile: CandidateProfile) => void;
  onRemoveResume: () => void;
}

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  baseResume,
  profile,
  onUpdateResume,
  onUpdateProfile,
  onRemoveResume,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CandidateProfile | null>(profile);

  const isResumeActive = Boolean(baseResume?.status === "parsed" && profile && profile.name.trim().length > 0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    toast.loading(`Extracting text from "${file.name}" with zero-hallucination engine...`, { id: "parsing-resume" });

    // Initial parsing state
    onUpdateResume(
      {
        fileName: file.name,
        fileSize: fileSizeStr,
        uploadDate: new Date().toLocaleDateString(),
        rawText: "",
        status: "parsing",
      },
      profile || {
        name: "Parsing...",
        email: "",
        phone: "",
        location: "",
        summary: "",
        skills: { languages: [], frameworks: [], tools: [], databases: [], softSkills: [] },
        experience: [],
        projects: [],
        education: [],
        certifications: [],
        achievements: [],
      }
    );

    try {
      const { rawText, profile: parsedProfile } = await parseResumeFile(file);

      onUpdateResume(
        {
          fileName: file.name,
          fileSize: fileSizeStr,
          uploadDate: new Date().toLocaleDateString(),
          rawText,
          status: "parsed",
        },
        parsedProfile
      );
      setEditedProfile(parsedProfile);
      toast.success(`Successfully parsed ${parsedProfile.name || file.name}!`, { id: "parsing-resume" });
    } catch {
      toast.error("Failed to parse resume file. Please try a different PDF or Word document.", { id: "parsing-resume" });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveEdit = () => {
    if (editedProfile) {
      onUpdateProfile(editedProfile);
      toast.success("Candidate profile updated successfully!");
    }
    setIsEditing(false);
  };

  const handleClear = () => {
    onRemoveResume();
    toast.info("Base resume and parsed profile removed.");
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone & File Status Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-3xl p-8 transition-all duration-300 ${
            isDragging
              ? "border-2 border-dashed border-primary bg-primary/10 shadow-glow"
              : "glass border-2 border-dashed border-border hover:border-primary/50"
          } lg:col-span-2`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.doc,.md"
            className="hidden"
          />

          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-brand shadow-glow animate-float">
              <Upload className="h-8 w-8 text-white" />
            </div>

            <h3 className="mt-4 text-xl font-bold tracking-tight">Upload your Base Resume</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag & drop your official PDF or DOCX file (up to 10MB)
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md text-white cursor-pointer active:scale-95 transition-all"
              >
                <Upload className="h-4 w-4" /> {isResumeActive ? "Replace Resume" : "Select File"}
              </button>

              {isResumeActive && (
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/20 cursor-pointer active:scale-95 transition-all"
                >
                  <Trash2 className="h-4 w-4" /> Remove Resume
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> PDF & DOCX Supported
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Real Text ATS Parsing
              </span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">Upload Status</h4>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isResumeActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : baseResume?.status === "parsing"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isResumeActive ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Parsed & Active
                  </>
                ) : baseResume?.status === "parsing" ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Parsing...
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" /> Awaiting Upload
                  </>
                )}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">File Name:</span>
                <span className="font-medium truncate max-w-[160px]">
                  {isResumeActive ? baseResume?.fileName : "No file chosen"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{isResumeActive ? baseResume?.fileSize : "—"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Parsed:</span>
                <span className="font-medium">{isResumeActive ? baseResume?.uploadDate : "—"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Parsed Candidate Profile</span>
            {isResumeActive && (
              <button
                onClick={() => {
                  setEditedProfile(profile);
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Parsed Information Grid - ONLY DISPLAYED IF RESUME IS UPLOADED */}
      {isResumeActive && profile ? (
        <div className="glass rounded-3xl p-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-base">
                {profile.name.charAt(0) || <User className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold">{profile.name}</h3>
                <p className="text-xs text-muted-foreground">Structured Candidate Profile Extracted from Base Resume</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditedProfile(profile);
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer transition-all active:scale-95"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile Details
            </button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Contact Details */}
            <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Contact Details
                  </div>
                  <button
                    onClick={() => {
                      setEditedProfile(profile);
                      setIsEditing(true);
                    }}
                    className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Edit3 className="h-3 w-3" /> Edit
                  </button>
                </div>
                <div className="mt-2.5 text-xs space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-foreground" /> {profile.email || "Not specified"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-foreground" /> {profile.phone || "Not specified"}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground" /> {profile.location || "Coimbatore, Tamil Nadu"}
                  </p>
                  {profile.linkedinUrl && (
                    <p className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-foreground shrink-0">LinkedIn:</span>
                      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                        {profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    </p>
                  )}
                  {profile.githubUrl && (
                    <p className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-foreground shrink-0">GitHub:</span>
                      <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                        {profile.githubUrl.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Core Technical Skills */}
            <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5" /> Core Languages & Frameworks
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[...profile.skills.languages, ...profile.skills.frameworks, ...profile.skills.databases, ...profile.skills.tools].length > 0 ? (
                  [...profile.skills.languages, ...profile.skills.frameworks, ...profile.skills.databases, ...profile.skills.tools].slice(0, 10).map((skill) => (
                    <span key={skill} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No technical skills detected in document</span>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> Education
              </div>
              {profile.education.length > 0 ? (
                profile.education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-semibold text-foreground">{edu.degree}</p>
                    <p className="text-muted-foreground">{edu.institution} {edu.score ? `• ${edu.score}` : ""}</p>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No education section detected</span>
              )}
            </div>

            {/* Key Technical Projects */}
            <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-3 lg:col-span-2">
              <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Key Technical Projects ({profile.projects.length})
                </span>
              </div>
              <div className="space-y-3">
                {profile.projects.length > 0 ? (
                  profile.projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="border-l-2 border-primary/40 pl-3 py-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground">{idx + 1}) {proj.title}</h4>
                        {proj.techStack && proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {proj.techStack.map(t => (
                              <span key={t} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{proj.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No projects listed</p>
                )}
              </div>
            </div>

            {/* Achievements & Certifications */}
            <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> Certifications & Courses
              </div>
              {profile.certifications.length > 0 || profile.achievements.length > 0 ? (
                <ul className="text-xs space-y-2 text-muted-foreground">
                  {profile.certifications.map((c, idx) => (
                    <li key={c.id || idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-primary shrink-0">{idx + 1})</span>
                      <span className="text-foreground">{c.name}</span>
                    </li>
                  ))}
                  {profile.achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-primary shrink-0">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">No certifications listed</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Placeholder when no resume is uploaded */
        <div className="glass rounded-3xl p-12 text-center border border-dashed border-border/80 flex flex-col items-center justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
            <FileUp className="h-8 w-8 text-primary opacity-80" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No Base Resume Uploaded Yet</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-md">
            Upload your official resume file above. Placify AI will automatically extract and structure your contact details, core technical skills, education history, work experience, and certifications.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all"
          >
            <Upload className="h-4 w-4" /> Select Resume File to Begin
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && editedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 space-y-4 shadow-2xl bg-background border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Edit Candidate Profile Details</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Phone Number</label>
                  <input
                    type="text"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">LinkedIn URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    value={editedProfile.linkedinUrl || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, linkedinUrl: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">GitHub URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={editedProfile.githubUrl || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, githubUrl: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Professional Summary</label>
                <textarea
                  rows={3}
                  value={editedProfile.summary}
                  onChange={(e) => setEditedProfile({ ...editedProfile, summary: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-gradient rounded-xl px-5 py-2 text-sm font-semibold shadow-md text-white cursor-pointer active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
