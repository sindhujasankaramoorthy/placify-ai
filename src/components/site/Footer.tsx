import { Link } from "@tanstack/react-router";
import { Sparkles, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-7xl px-4 pb-12">
      <div className="rounded-3xl p-8 glass md:p-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand">
                <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold">Placify<span className="text-gradient"> AI</span></span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              AI-powered placement & resume assistant for students.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><Link to="/dashboard/resume" className="hover:text-foreground">Resume Builder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
              <li><a href="#privacy" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#terms" className="hover:text-foreground">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Follow</h4>
            <div className="mt-3 flex gap-2">
              <a href="#" className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-accent" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-accent" aria-label="GitHub"><Github className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Placify AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
