import { createFileRoute } from "@tanstack/react-router";
import { ResumeBuilderContainer } from "@/components/resume/ResumeBuilderContainer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Placify AI — Resume Builder" },
      { name: "description", content: "Build dynamic ATS-friendly resumes with live preview and instant score analysis." },
      { property: "og:title", content: "Placify AI — Resume Builder" },
      { property: "og:description", content: "Interactive ATS Resume Builder with 10 templates and live feedback." },
    ],
  }),
  component: StandaloneResumePage,
});

function StandaloneResumePage() {
  return <ResumeBuilderContainer />;
}
