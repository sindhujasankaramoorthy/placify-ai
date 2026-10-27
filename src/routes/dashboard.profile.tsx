import { createFileRoute, Link } from "@tanstack/react-router";
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
  BookOpen,
  Building,
  ShieldCheck,
  Briefcase,
  SlidersHorizontal,
  RotateCcw,
  KeyRound,
  X,
  FileCheck,
  Building2,
  IdCard,
  FileText
} from "lucide-react";
import { CandidateProfile } from "../lib/resume/types";
import { toast } from "sonner";
import { getActiveUser, setActiveUser, onAuthChange, PlacifyUser } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Placement Profile — Placify AI" },
      { name: "description", content: "View and edit your placement profile details." },
      { property: "og:title", content: "Placement Profile — Placify AI" },
    ],
  }),
  component: ProfilePage,
});

/* =========================================================================
   OFFICER PROFILE DATA STRUCTURE & DEFAULTS
   ========================================================================= */
interface OfficerProfileData {
  fullName: string;
  designation: string;
  staffId: string;
  department: string;
  officialEmail: string;
  directPhone: string;
  officeLocation: string;
  institutionName: string;
  accreditation: string;
  cohortYear: string;
  departmentsCovered: string;
  dreamOfferThreshold: string;
  superDreamThreshold: string;
  maxOffersPerStudent: string;
  signatoryTitle: string;
  helpdeskEmail: string;
  visionStatement: string;
}

const defaultOfficerProfile: OfficerProfileData = {
  fullName: "Dr. K. Ramesh",
  designation: "Head of Training & Placements",
  staffId: "SIET-TPO-042",
  department: "Central Directorate of Training & Placements",
  officialEmail: "placement.officer@srishakthi.ac.in",
  directPhone: "+91 94432 10987",
  officeLocation: "Placement Cell Block A, 2nd Floor, Room 204",
  institutionName: "Sri Shakthi Institute of Engineering and Technology",
  accreditation: "Autonomous • Affiliated to Anna University • Approved by AICTE • NAAC 'A' Grade",
  cohortYear: "2025-2026 Graduating Batch",
  departmentsCovered: "CSE, IT, ECE, EEE, MECH, AI&DS, BIOMEDICAL",
  dreamOfferThreshold: "10.0",
  superDreamThreshold: "18.0",
  maxOffersPerStudent: "2",
  signatoryTitle: "Dr. K. Ramesh, Ph.D. (Director & Head of Placements)",
  helpdeskEmail: "placements@srishakthi.ac.in",
  visionStatement:
    "Dedicated to fostering robust industry-academia partnerships, elevating student employability, and ensuring 100% career placement for engineering graduates with top global tech organizations.",
};

/* =========================================================================
   OFFICER PROFILE FORM (ADMIN MODE)
   ========================================================================= */
function OfficerProfileForm({ currentUser }: { currentUser: PlacifyUser }) {
  const [profile, setProfile] = useState<OfficerProfileData>(defaultOfficerProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<OfficerProfileData>(defaultOfficerProfile);

  // Load saved officer profile from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("placify_officer_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile(parsed);
          setForm(parsed);
          return;
        }
      } catch (e) {
        console.error("Error reading saved officer profile:", e);
      }
      setProfile(defaultOfficerProfile);
      setForm(defaultOfficerProfile);
    }
  }, []);

  const handleChange = (field: keyof OfficerProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.fullName.trim() || !form.officialEmail.trim()) {
      toast.error("Officer Name and Institutional Email are required.");
      return;
    }

    setProfile(form);
    localStorage.setItem("placify_officer_profile", JSON.stringify(form));

    // Synchronize active user state in auth context so header & sidebar reflect updates
    setActiveUser({
      ...currentUser,
      name: form.fullName,
      title: form.designation,
      email: form.officialEmail,
      department: form.department,
      avatarLetter: form.fullName.charAt(0).toUpperCase() || "R",
    });

    setIsEditing(false);
    toast.success("Officer profile updated successfully! Changes saved to system.");
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    if (confirm("Reset officer profile to institutional default records?")) {
      setForm(defaultOfficerProfile);
      setProfile(defaultOfficerProfile);
      localStorage.setItem("placify_officer_profile", JSON.stringify(defaultOfficerProfile));
      setActiveUser({
        ...currentUser,
        name: defaultOfficerProfile.fullName,
        title: defaultOfficerProfile.designation,
        email: defaultOfficerProfile.officialEmail,
        department: defaultOfficerProfile.department,
        avatarLetter: "R",
      });
      setIsEditing(false);
      toast.info("Officer profile reset to default records.");
    }
  };

  return (
    <div className="space-y-6 text-foreground font-sans max-w-5xl">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-blue-600 text-white font-black text-2xl shadow-xl shadow-blue-600/30 shrink-0 border border-blue-400/30">
              {profile.fullName.charAt(0) || "R"}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {profile.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-0.5 text-xs font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                  Head of Placements (Admin)
                </span>
                <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                  {profile.staffId}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium">
                {profile.designation} • {profile.department}
              </p>
              <p className="text-xs text-slate-400">
                {profile.institutionName} • {profile.accreditation}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!isEditing ? (
              <button
                onClick={() => {
                  setForm(profile);
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Officer Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <X className="h-3.5 w-3.5 inline mr-1" /> Cancel
                </button>
                <button
                  onClick={() => handleSave()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FORM / VIEW BODY */}
      {isEditing ? (
        /* EDIT MODE FORM */
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Officer Personal & Institutional Coordinates */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <IdCard className="h-4 w-4 text-primary" /> Officer Identification & Coordinates
              </h2>
              <span className="text-[11px] text-muted-foreground font-medium">Editable Form Fields</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Officer Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Dr. K. Ramesh"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Official Designation *</label>
                <input
                  type="text"
                  required
                  value={form.designation}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Head of Training & Placements"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Faculty / Staff ID *</label>
                <input
                  type="text"
                  required
                  value={form.staffId}
                  onChange={(e) => handleChange("staffId", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-mono font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="SIET-TPO-042"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Official Email *</label>
                <input
                  type="email"
                  required
                  value={form.officialEmail}
                  onChange={(e) => handleChange("officialEmail", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="placement.officer@srishakthi.ac.in"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Direct Contact / Extension</label>
                <input
                  type="text"
                  value={form.directPhone}
                  onChange={(e) => handleChange("directPhone", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="+91 94432 10987"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Office Room & Campus Block</label>
                <input
                  type="text"
                  value={form.officeLocation}
                  onChange={(e) => handleChange("officeLocation", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Block A, 2nd Floor, Room 204"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Institution & Directorate Scope */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" /> Institution & Directorate Scope
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Institution Name</label>
                <input
                  type="text"
                  value={form.institutionName}
                  onChange={(e) => handleChange("institutionName", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Accreditation / Affiliation</label>
                <input
                  type="text"
                  value={form.accreditation}
                  onChange={(e) => handleChange("accreditation", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Active Recruitment Cohort</label>
                <input
                  type="text"
                  value={form.cohortYear}
                  onChange={(e) => handleChange("cohortYear", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="2025-2026 Graduating Batch"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Departments Under Oversight</label>
                <input
                  type="text"
                  value={form.departmentsCovered}
                  onChange={(e) => handleChange("departmentsCovered", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                  placeholder="CSE, IT, ECE, EEE, MECH..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Institutional Placement Policy Thresholds */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Placement Policy & Offer Thresholds
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Dream Offer Threshold (LPA)</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    value={form.dreamOfferThreshold}
                    onChange={(e) => handleChange("dreamOfferThreshold", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-7 pr-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Super Dream Threshold (LPA)</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    value={form.superDreamThreshold}
                    onChange={(e) => handleChange("superDreamThreshold", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-7 pr-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Max Offers Allowed / Candidate</label>
                <input
                  type="text"
                  value={form.maxOffersPerStudent}
                  onChange={(e) => handleChange("maxOffersPerStudent", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary outline-none"
                  placeholder="2"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Vision Statement & Authorized Signatory */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" /> Placement Cell Vision & Signatory Credentials
              </h2>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Directorate Vision & Placement Policy Statement</label>
              <textarea
                rows={3}
                value={form.visionStatement}
                onChange={(e) => handleChange("visionStatement", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Authorized LOI Verification Signatory</label>
                <input
                  type="text"
                  value={form.signatoryTitle}
                  onChange={(e) => handleChange("signatoryTitle", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Placement Cell Helpdesk Email</label>
                <input
                  type="email"
                  value={form.helpdeskEmail}
                  onChange={(e) => handleChange("helpdeskEmail", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset to Demo Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" /> Save Officer Profile
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* VIEW MODE FORM-CARD PRESENTATION */
        <div className="space-y-6">
          {/* Quick Contact & Office Strip */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Official Email</span>
                <div className="text-xs font-bold text-foreground truncate">{profile.officialEmail}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Direct Telephone</span>
                <div className="text-xs font-bold text-foreground truncate">{profile.directPhone}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Campus Directorate</span>
                <div className="text-xs font-bold text-foreground truncate">{profile.officeLocation}</div>
              </div>
            </div>
          </div>

          {/* Placement Administration Details Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1: Authority Scope */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Directorate & Oversight Scope
                </h3>
                <span className="rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-0.5">
                  Verified Authority
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  <div className="font-semibold text-foreground mt-0.5">{profile.department}</div>
                </div>

                <div>
                  <span className="text-muted-foreground">Active Recruitment Cohort:</span>
                  <div className="font-semibold text-primary mt-0.5">{profile.cohortYear}</div>
                </div>

                <div>
                  <span className="text-muted-foreground">Disciplines Covered:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {profile.departmentsCovered.split(",").map((d) => (
                      <span key={d} className="rounded-lg bg-muted px-2.5 py-0.5 text-[10px] font-bold">
                        {d.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">Placement Cell Helpdesk:</span>
                  <div className="font-medium text-foreground mt-0.5">{profile.helpdeskEmail}</div>
                </div>
              </div>
            </div>

            {/* Card 2: Institutional Thresholds */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" /> Active Placement Policies
                </h3>
                <Link
                  to="/dashboard/admin/placements"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View Analytics →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-border bg-accent/20 p-3.5">
                  <span className="text-muted-foreground">Dream Offer Policy</span>
                  <div className="text-lg font-black text-primary mt-1">₹{profile.dreamOfferThreshold}+ LPA</div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Eligible for further dream interviews</p>
                </div>

                <div className="rounded-2xl border border-border bg-accent/20 p-3.5">
                  <span className="text-muted-foreground">Super Dream Policy</span>
                  <div className="text-lg font-black text-purple-600 mt-1">₹{profile.superDreamThreshold}+ LPA</div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Highest tier open privilege</p>
                </div>

                <div className="rounded-2xl border border-border bg-accent/20 p-3.5 col-span-2">
                  <span className="text-muted-foreground">Max Offers Permitted per Candidate</span>
                  <div className="text-base font-bold text-foreground mt-0.5">
                    {profile.maxOffersPerStudent} Verified Offers Max
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Vision Statement */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Directorate Placement Policy Statement
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed italic bg-accent/20 p-4 rounded-2xl border border-border">
              "{profile.visionStatement}"
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Authorized Signatory: <strong className="text-foreground">{profile.signatoryTitle}</strong></span>
              <button
                onClick={() => {
                  setForm(profile);
                  setIsEditing(true);
                }}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Edit Statement & Thresholds →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   STUDENT CANDIDATE PROFILE (STUDENT MODE)
   ========================================================================= */
const defaultStudentProfile: CandidateProfile = {
  name: "Sindhuja Sankaramoorthy",
  email: "sindhujas24cs@srishakthi.ac.in",
  phone: "+91 82204 54776",
  location: "Coimbatore, Tamil Nadu",
  summary:
    "Aspiring Computer Science & Engineering candidate (2026 Batch) with a strong foundation in Java, Python, C, SQL, and full-stack development. Proven track record building intelligent RAG chatbots, modern web applications, and data-driven systems.",
  githubUrl: "https://github.com/sindhujasankaramoorthy",
  linkedinUrl: "https://www.linkedin.com/in/sindhuja-sankaramoorthy/",
  skills: {
    languages: ["SQL", "Java", "C", "HTML", "CSS", "MongoDB", "Python", "Problem Solving"],
    frameworks: [],
    databases: [],
    tools: [],
    softSkills: [],
  },
  projects: [
    {
      id: "chatbot-1",
      title: "RAG-Based Resume Intelligence Chatbot",
      description: "AI-powered candidate scanner using Retrieval-Augmented Generation, vector embeddings, and FAISS indexing.",
      techStack: ["Python", "FAISS", "RAG", "Vector Embeddings"],
      highlights: ["Speeds up resume qualification cycles by 60%"],
    },
    {
      id: "mindaura-2",
      title: "MindAura AI",
      description: "AI-driven wellness platform matching users with cognitive support routines.",
      techStack: ["React", "Python", "MongoDB"],
      highlights: ["Integrated responsive UI frameworks"],
    },
    {
      id: "splitwise-3",
      title: "SplitWise - Expense Splitter",
      description: "OOP expense calculator implementing Java graph traversals to minimize debt transactions.",
      techStack: ["Java", "OOP"],
      highlights: ["Optimizes transaction resolution logic"],
    },
    {
      id: "laundry-4",
      title: "Laundry Management System",
      description: "Relational database web console to monitor order states, customer ledger details, and inventory catalogs.",
      techStack: ["HTML", "CSS", "SQL"],
      highlights: ["Designed structured relational schemas"],
    },
  ],
  experience: [],
  education: [
    {
      id: "edu-1",
      institution: "Sri Shakthi Institute of Engineering and Technology",
      degree: "B.E. Computer Science and Engineering",
      graduationYear: "2026 Batch",
      score: "CGPA: 8.6 / 10.0",
    },
  ],
  certifications: [
    { id: "cert-1", name: "The Complete Full-Stack Web Development Bootcamp", issuer: "Udemy" },
    { id: "cert-2", name: "Object Oriented Programming: Basics to Advance (Java OOP)", issuer: "Udemy" },
    { id: "cert-3", name: "Problem Solving Through Programming in C", issuer: "NPTEL" },
  ],
  achievements: [],
};

function StudentProfileView() {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("placify_candidate_profile");
        const current: CandidateProfile = saved ? JSON.parse(saved) : defaultStudentProfile;
        setProfile(current);

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
          score: cgpa,
        },
      ],
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

/* =========================================================================
   MAIN EXPORT ROUTE COMPONENT (ROLE-DISPATCHED)
   ========================================================================= */
function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<PlacifyUser>(() => getActiveUser());

  useEffect(() => {
    setCurrentUser(getActiveUser());
    const unsub = onAuthChange((u) => setCurrentUser(u));
    return unsub;
  }, []);

  if (currentUser.role === "admin") {
    return <OfficerProfileForm currentUser={currentUser} />;
  }

  return <StudentProfileView />;
}
