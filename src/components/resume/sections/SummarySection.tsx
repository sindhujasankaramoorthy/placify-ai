import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface Props {
  summary: string;
  onChange: (summary: string) => void;
}

export const SummarySection: React.FC<Props> = ({ summary, onChange }) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <FileText className="h-3.5 w-3.5 text-primary" /> Professional Summary
      </Label>
      <Textarea
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a compelling summary highlighting your core skills, key achievements, and career focus..."
        rows={5}
        className="bg-card resize-y"
      />
    </div>
  );
};
