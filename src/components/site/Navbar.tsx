import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/resume", label: "Resume Builder" },
  { to: "/dashboard/jobs", label: "Jobs" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-4 py-3 glass-strong">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand shadow-[0_8px_24px_-8px] shadow-primary/50">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">Placify<span className="text-gradient"> AI</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
            Login
          </Link>
          <Link to="/signup" className="rounded-xl px-4 py-2 text-sm font-semibold btn-gradient">
            Sign Up
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-border md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl p-3 glass-strong md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl border border-border px-4 py-2 text-center text-sm font-semibold">Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2 text-center text-sm font-semibold btn-gradient">Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
