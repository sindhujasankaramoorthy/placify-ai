import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Award,
  FolderGit2,
  Pencil,
  Save,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { CandidateProfile } from "../lib/resume/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Placement Profile — Placify AI" },
      { name: "description", content: "View and edit your placement profile details." },
    ],
  }),
  component: ProfilePage,
});

// Default candidate profile representation matching user specifications
const defaultProfile: CandidateProfile = {
  name: "Sindhuja Sankaramoorthy",
  email: "sindhujas24cs@srishakthi.ac.in",
  phone: "+91 82204 54776",
  location: "Coimbatore, Tamil Nadu",
  summary: "Aspiring Computer Science & Engineering candidate (2026 Batch) with a strong foundation in Java, Python, C, SQL, and full-stack development. Proven track record building intelligent RAG chatbots, modern web applications, and data-driven systems.",
  githubUrl: "https://github.com/sindhujasankaramoorthy",
  linkedinUrl: "https://www.linkedin.com/in/sindhuja-sankaramoorthy/",
  skills: {
    languages: ["SQL", "Java", "C", "HTML", "CSS", "MongoDB", "Python", "Problem Solving"],
    frameworks: [],
    databases: [],
    tools: [],
    softSkills: []
  },
  projects: [
    {
      id: "chatbot-1",
      title: "RAG-Based Resume Intelligence Chatbot",
      description: "AI-powered candidate scanner using Retrieval-Augmented Generation, vector embeddings, and FAISS indexing.",
      techStack: ["Python", "FAISS", "RAG", "Vector Embeddings"],
      highlights: ["Speeds up resume qualification cycles by 60%"]
    },
    {
      id: "mindaura-2",
      title: "MindAura AI",
      description: "AI-driven wellness platform matching users with cognitive support routines.",
      techStack: ["React", "Python", "MongoDB"],
      highlights: ["Integrated responsive UI frameworks"]
    },
    {
      id: "splitwise-3",
      title: "SplitWise - Expense Splitter",
      description: "OOP expense calculator implementing Java graph traversals to minimize debt transactions.",
      techStack: ["Java", "OOP"],
      highlights: ["Optimizes transaction resolution logic"]
    },
    {
      id: "laundry-4",
      title: "Laundry Management System",
      description: "Relational database web console to monitor order states, customer ledger details, and inventory catalogs.",
      techStack: ["HTML", "CSS", "SQL"],
      highlights: ["Designed structured relational schemas"]
    }
  ],
  experience: [],
  education: [
    {
      id: "edu-1",
      institution: "Sri Shakthi Institute of Engineering and Technology",
      degree: "B.E. Computer Science and Engineering",
      graduationYear: "2026 Batch",
      score: "CGPA: 8.6 / 10.0"
    }
  ],
  certifications: [
    { id: "cert-1", name: "The Complete Full-Stack Web Development Bootcamp", issuer: "Udemy" },
    { id: "cert-2", name: "Object Oriented Programming: Basics to Advance (Java OOP)", issuer: "Udemy" },
    { id: "cert-3", name: "Problem Solving Through Programming in C", issuer: "NPTEL" }
  ],
  achievements: []
};

function ProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [college, setCollege] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [skillsList, setSkillsList] = useState("");

  // Load profile on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("placify_candidate_profile");
        const current: CandidateProfile = saved ? JSON.parse(saved) : defaultProfile;
        setProfile(current);
        
        // Populate inputs
        setName(current.name);
        setEmail(current.email);
        setPhone(current.phone);
        setLocation(current.location);
        
        const edu = current.education?.[0];
        setCollege(edu?.institution || "");
        setCgpa(edu?.score || "");
        
        const languages = current.skills?.languages || [];
        setSkillsList(languages.join(", "));
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  const handleSaveProfile = () => {
    if (!profile) return;

    const updatedProfile: CandidateProfile = {
      ...profile,
      name,
      email,
      phone,
      location,
      skills: {
        ...profile.skills,
        languages: skillsList.split(",").map((s) => s.trim()).filter(Boolean),
      },
      education: [
        {
          id: profile.education?.[0]?.id || "edu-1",
          institution: college,
          degree: profile.education?.[0]?.degree || "B.E. Computer Science and Engineering",
          graduationYear: profile.education?.[0]?.graduationYear || "2026 Batch",
          score: cgpa
        }
      ]
    };

    localStorage.setItem("placify_candidate_profile", JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setIsEditing(false);
    toast.success("Profile details updated successfully!");
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="rounded-3xl p-6 glass md:p-8 border border-border">
        {isEditing ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Edit Student Profile Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">College / Institution</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">CGPA / Score</label>
                <input
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="btn-gradient inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Save className="h-3.5 w-3.5" /> Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-6">
            <div className="grid h-24 w-24 place-items-center rounded-3xl gradient-brand text-3xl font-extrabold text-white">
              {profile.name[0]}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                  Verified Candidate
                </span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> {profile.education?.[0]?.degree || "Candidate Profile"}
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" /> {college || "Academic College"}
                </span>
                <span>CGPA: <b className="text-foreground">{cgpa || "N/A"}</b></span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {profile.email}</span>
                <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {profile.phone}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold btn-gradient cursor-pointer active:scale-95 transition-all text-white shadow-sm"
            >
              <Pencil className="h-4 w-4" /> Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Skills, Projects, and Certifications Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Skills Card */}
        <div className="rounded-2xl p-6 glass border border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">Skills Matrix</h3>
            {isEditing && <span className="text-[10px] text-muted-foreground">Comma-separated list</span>}
          </div>

          {isEditing ? (
            <textarea
              rows={4}
              value={skillsList}
              onChange={(e) => setSkillsList(e.target.value)}
              className="w-full rounded-xl border border-border bg-card p-3 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary outline-none"
              placeholder="SQL, Java, C, MongoDB..."
            />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(profile.skills?.languages || []).map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Projects Card */}
        <div className="rounded-2xl p-6 glass border border-border lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-primary" /> Key Placement Projects
            </h3>
          </div>

          <ul className="space-y-3">
            {(profile.projects || []).map((p, idx) => (
              <li key={p.id || idx} className="rounded-xl border border-border bg-card/40 p-4 space-y-1.5 hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-foreground">{p.title}</div>
                  <div className="flex flex-wrap gap-1">
                    {(p.techStack || []).map((t) => (
                      <span key={t} className="rounded px-2 py-0.5 text-[9px] font-bold bg-primary/10 text-primary">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground leading-normal">{p.description}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications Card */}
        <div className="rounded-2xl p-6 glass border border-border lg:col-span-3 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" /> Verified Certifications
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            {(profile.certifications || []).map((c, idx) => (
              <div
                key={c.id || idx}
                className="rounded-xl border border-border bg-card/40 p-4 flex flex-col justify-between space-y-2 hover:border-primary/20 transition-all"
              >
                <div className="text-xs font-extrabold text-foreground">{c.name}</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Issued by {c.issuer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
