import { createFileRoute } from "@tanstack/react-router";
import { ResumeBuilderContainer } from "@/components/resume/ResumeBuilderContainer";

export const Route = createFileRoute("/dashboard/resume")({
  head: () => ({
    meta: [
      { title: "Resume Builder — Placify AI" },
      { name: "description", content: "Build dynamic ATS-friendly resumes with live preview." },
      { property: "og:title", content: "Resume Builder — Placify AI" },
      { property: "og:description", content: "Interactive Resume Builder." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return <ResumeBuilderContainer />;
}
