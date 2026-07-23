import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Placify AI" },
      { name: "description", content: "Create your Placify AI account and start your placement journey." },
      { property: "og:title", content: "Sign Up — Placify AI" },
      { property: "og:description", content: "Join Placify AI and land your dream role." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />
        <section className="mx-auto mt-16 max-w-md">
          <div className="rounded-3xl p-8 glass-strong">
            <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">Start your placement journey with AI.</p>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium">Full name</label>
                <input required className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Sindhuja" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input type="email" required className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@college.edu" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input type="password" required className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
              </div>
              <button className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold btn-gradient">Create account</button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Have an account? <Link to="/login" className="font-semibold text-primary">Login</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
