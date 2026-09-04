import React from "react";
import { Education } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface Props {
  items: Education[];
  onChange: (items: Education[]) => void;
}

export const EducationSection: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newEntry: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      gpa: "",
      location: "",
    };
    onChange([...items, newEntry]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Education, value: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" /> Education #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="Remove Education"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium">Institution / University</Label>
              <Input
                value={item.institution}
                onChange={(e) => handleUpdate(item.id, "institution", e.target.value)}
                placeholder="e.g. Stanford University"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Degree</Label>
              <Input
                value={item.degree}
                onChange={(e) => handleUpdate(item.id, "degree", e.target.value)}
                placeholder="e.g. Bachelor of Science"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Field of Study / Major</Label>
              <Input
                value={item.fieldOfStudy}
                onChange={(e) => handleUpdate(item.id, "fieldOfStudy", e.target.value)}
                placeholder="e.g. Computer Science"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">GPA / Grade (Optional)</Label>
              <Input
                value={item.gpa}
                onChange={(e) => handleUpdate(item.id, "gpa", e.target.value)}
                placeholder="e.g. 3.8 / 4.0 or 8.9 CGPA"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Start Date</Label>
              <Input
                value={item.startDate}
                onChange={(e) => handleUpdate(item.id, "startDate", e.target.value)}
                placeholder="e.g. Sep 2021"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">End Date / Expected</Label>
              <Input
                value={item.endDate}
                onChange={(e) => handleUpdate(item.id, "endDate", e.target.value)}
                placeholder="e.g. May 2025"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed border-border hover:bg-accent text-sm font-semibold flex items-center justify-center gap-2 py-3"
      >
        <Plus className="h-4 w-4" /> Add Education
      </Button>
    </div>
  );
};
