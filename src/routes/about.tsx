import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Placify AI" },
      { name: "description", content: "Placify AI is on a mission to make placements accessible, fair and student-first." },
      { property: "og:title", content: "About — Placify AI" },
      { property: "og:description", content: "Our mission: make placements student-first with AI." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar />
        <section className="mt-16 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            About <span className="text-gradient">Placify AI</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Placify AI is on a mission to make campus placements smarter, faster, and fair.
            We combine cutting-edge AI with a delightful student experience to help every
            learner discover the right opportunities and put their best foot forward.
          </p>
          <p className="mt-4 text-muted-foreground">
            Built with love by educators and engineers, Placify AI is trusted by students
            across hundreds of campuses to land offers at top companies.
          </p>
        </section>
        <Footer />
      </div>
    </div>
  );
}
