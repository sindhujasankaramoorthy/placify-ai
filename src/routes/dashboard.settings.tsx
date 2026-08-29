import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Save, Shield, Bell, Eye, Sliders, Laptop, Settings, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Placement Settings — Placify AI" },
      { name: "description", content: "Manage your placement accounts and dashboard preferences." },
    ],
  }),
  component: SettingsPage,
});

interface SettingsConfig {
  email: string;
  theme: "light" | "dark" | "system";
  atsMatchSensitivity: number;
  deadlinesAlerts: boolean;
  interviewAlerts: boolean;
  recommendationsAlerts: boolean;
  weeklyDigestAlerts: boolean;
}

const defaultSettings: SettingsConfig = {
  email: "sindhujas24cs@srishakthi.ac.in",
  theme: "light",
  atsMatchSensitivity: 80,
  deadlinesAlerts: true,
  interviewAlerts: true,
  recommendationsAlerts: true,
  weeklyDigestAlerts: false,
};

function SettingsPage() {
  const [settings, setSettings] = useState<SettingsConfig>(defaultSettings);

  // Load settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedProfile = localStorage.getItem("placify_candidate_profile");
        let defaultEmail = defaultSettings.email;
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (parsed.email) defaultEmail = parsed.email;
        }

        const savedSettings = localStorage.getItem("placify_settings");
        if (savedSettings) {
          setSettings({
            ...defaultSettings,
            ...JSON.parse(savedSettings),
            email: defaultEmail // Sync email from profile
          });
        } else {
          setSettings((prev) => ({ ...prev, email: defaultEmail }));
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("placify_settings", JSON.stringify(settings));
    toast.success("Preferences saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure system configurations, alerts preferences, and match threshold sensitivities.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="btn-gradient inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <Save className="h-3.5 w-3.5" /> Save Preferences
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Account & Profile Configuration */}
        <div className="space-y-6">
          {/* Account Details */}
          <div className="rounded-3xl p-6 glass border border-border space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Placement Account Configurations
            </h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Primary Contact Email (Synced)</label>
                <input
                  type="email"
                  disabled
                  value={settings.email}
                  className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground cursor-not-allowed outline-none"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">To update email, change details on the Profile page.</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border/80">
                <span className="text-xs font-semibold text-foreground">Current Subscription Tier</span>
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-bold text-primary uppercase">
                  College Student (Free)
                </span>
              </div>
            </div>
          </div>

          {/* ATS Sensitivity Slider */}
          <div className="rounded-3xl p-6 glass border border-border space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" /> ATS Match Filter Sensitivity
            </h3>
            <p className="text-xs text-muted-foreground leading-normal">
              Adjust minimum fit index required before flagging placement matching cards.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Minimum Match Index</span>
                <span className="text-primary">{settings.atsMatchSensitivity}% Fit</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.atsMatchSensitivity}
                onChange={(e) => setSettings({ ...settings, atsMatchSensitivity: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>50% (Permissive)</span>
                <span>80% (Standard)</span>
                <span>95% (Strict)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & UI Configurations */}
        <div className="space-y-6">
          {/* Notifications Preferences */}
          <div className="rounded-3xl p-6 glass border border-border space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> Notification Alerts Preferences
            </h3>
            
            <div className="space-y-3">
              {[
                { key: "deadlinesAlerts", label: "Placement Deadline Alerts", desc: "Alerts for upcoming college placement cycles and exam registrations." },
                { key: "interviewAlerts", label: "Interview Schedule Reminders", desc: "Push notification alert reminders 30 minutes before client panel sessions." },
                { key: "recommendationsAlerts", label: "Tailored Job Openings", desc: "Notification updates when matched jobs are uploaded to directory." },
                { key: "weeklyDigestAlerts", label: "Weekly Progress Digests", desc: "Weekly summaries of profile metrics, resume matches, and applications." }
              ].map((item) => (
                <label key={item.key} className="flex items-start justify-between gap-4 p-2 rounded-xl hover:bg-card/40 transition-colors cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground block leading-normal">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={(settings as any)[item.key]}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="h-4 w-4 mt-0.5 accent-primary cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Theme & Display preferences */}
          <div className="rounded-3xl p-6 glass border border-border space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Laptop className="h-4 w-4 text-primary" /> Visual Theme Preference
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "light", label: "Classic Light" },
                { id: "dark", label: "Modern Dark" },
                { id: "system", label: "System Sync" }
              ].map((themeOpt) => (
                <button
                  key={themeOpt.id}
                  onClick={() => {
                    const newTheme = themeOpt.id as "light" | "dark" | "system";
                    const newSettings = { ...settings, theme: newTheme };
                    setSettings(newSettings);
                    localStorage.setItem("placify_settings", JSON.stringify(newSettings));
                    
                    if (typeof document !== "undefined") {
                      if (newTheme === "dark") {
                        document.documentElement.classList.add("dark");
                      } else if (newTheme === "light") {
                        document.documentElement.classList.remove("dark");
                      } else {
                        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                        document.documentElement.classList.toggle("dark", systemPrefersDark);
                      }
                    }
                    
                    window.dispatchEvent(new Event("theme-changed"));
                    toast.success(`Theme set to ${themeOpt.label}`);
                  }}
                  className={`rounded-xl border p-3 text-center text-xs font-bold transition-all cursor-pointer ${
                    settings.theme === themeOpt.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card/45 hover:border-primary/30"
                  }`}
                >
                  {themeOpt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
