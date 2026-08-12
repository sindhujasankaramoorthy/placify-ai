import React, { useRef, useState } from "react";
import { Upload, FileText, CheckCircle2, RefreshCw, Edit3, User, Mail, Phone, MapPin, Sparkles, Code, Briefcase, GraduationCap, Award } from "lucide-react";
import { BaseResume, CandidateProfile } from "../../lib/resume/types";
import { parseResumeFile } from "../../lib/resume/parser";

interface ResumeUploadSectionProps {
  baseResume: BaseResume;
  profile: CandidateProfile;
  onUpdateResume: (resume: BaseResume, profile: CandidateProfile) => void;
  onUpdateProfile: (profile: CandidateProfile) => void;
}

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  baseResume,
  profile,
  onUpdateResume,
  onUpdateProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CandidateProfile>(profile);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    onUpdateResume(
      {
        fileName: file.name,
        fileSize: fileSizeStr,
        uploadDate: new Date().toLocaleDateString(),
        rawText: "",
        status: "parsing",
      },
      profile
    );

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
    onUpdateProfile(editedProfile);
    setIsEditing(false);
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
            accept=".pdf,.docx,.txt"
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
                className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md"
              >
                <Upload className="h-4 w-4" /> Select File
              </button>

              {baseResume.status === "parsed" && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  <RefreshCw className="h-4 w-4 text-muted-foreground" /> Replace Resume
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> PDF & DOCX Supported</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-primary" /> Auto ATS Parsing</span>
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
                  baseResume.status === "parsed"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : baseResume.status === "parsing"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {baseResume.status === "parsed" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Parsed & Active
                  </>
                ) : baseResume.status === "parsing" ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Parsing...
                  </>
                ) : (
                  "Ready for Upload"
                )}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">File Name:</span>
                <span className="font-medium truncate max-w-[160px]">{baseResume.fileName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{baseResume.fileSize}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Parsed:</span>
                <span className="font-medium">{baseResume.uploadDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Parsed Candidate Profile</span>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Information
            </button>
          </div>
        </div>
      </div>

      {/* Structured Parsed Information Grid */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{profile.name}</h3>
              <p className="text-xs text-muted-foreground">Structured Candidate Profile Extracted from Base Resume</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-accent"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile Details
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Details */}
          <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Contact Details
            </div>
            <div className="text-xs space-y-1.5 text-muted-foreground">
              <p className="flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 shrink-0 text-foreground" /> {profile.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0 text-foreground" /> {profile.phone}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 text-foreground" /> {profile.location}</p>
            </div>
          </div>

          {/* Core Technical Skills */}
          <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5" /> Core Languages & Frameworks
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...profile.skills.languages, ...profile.skills.frameworks].slice(0, 7).map((skill) => (
                <span key={skill} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" /> Education
            </div>
            {profile.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <p className="font-semibold text-foreground">{edu.degree}</p>
                <p className="text-muted-foreground">{edu.institution} • {edu.score}</p>
              </div>
            ))}
          </div>

          {/* Work Experience */}
          <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5 lg:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" /> Extracted Work Experience
            </div>
            <div className="space-y-3">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary/30 pl-3">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground">{exp.role} @ {exp.company}</span>
                    <span className="text-muted-foreground">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{exp.highlights[0]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Certifications */}
          <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" /> Certifications & Awards
            </div>
            <ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
              {profile.certifications.map((c) => (
                <li key={c.id} className="truncate">{c.name} ({c.issuer})</li>
              ))}
              {profile.achievements.slice(0, 2).map((a, i) => (
                <li key={i} className="truncate">{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Edit Candidate Profile Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
                  <input
                    type="text"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Professional Summary</label>
                <textarea
                  rows={3}
                  value={editedProfile.summary}
                  onChange={(e) => setEditedProfile({ ...editedProfile, summary: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-gradient rounded-xl px-5 py-2 text-sm font-semibold shadow-md"
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
