import { createFileRoute } from "@tanstack/react-router";
import { ResumePersonalizer } from "../components/resume/ResumePersonalizer";

export const Route = createFileRoute("/dashboard/personalizer")({
  head: () => ({
    meta: [
      { title: "AI Resume Personalizer (Zero-Hallucination) — Placify AI" },
      {
        name: "description",
        content:
          "Upload your resume and personalize it strictly against chosen engineering jobs with 100% truthfulness and zero hallucinated claims.",
      },
      { property: "og:title", content: "AI Resume Personalizer — Placify AI" },
    ],
  }),
  component: PersonalizerPage,
});

function PersonalizerPage() {
  return <ResumePersonalizer />;
}
