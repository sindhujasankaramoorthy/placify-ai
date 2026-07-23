import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Placify AI" },
      { name: "description", content: "Manage your Placify AI account settings." },
      { property: "og:title", content: "Settings — Placify AI" },
      { property: "og:description", content: "Account settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and preferences.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Account</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Email</span><span>sindhuja@college.edu</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Plan</span><span className="font-semibold text-primary">Student · Free</span></div>
          </div>
        </div>
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Notifications</h3>
          <div className="mt-4 space-y-3 text-sm">
            {["Placement deadlines", "Interview alerts", "Job recommendations", "Weekly digest"].map((t) => (
              <label key={t} className="flex items-center justify-between">
                <span>{t}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[oklch(0.55_0.22_265)]" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
