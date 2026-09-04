import React from "react";
import { SkillCategory } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Wrench } from "lucide-react";

interface Props {
  items: SkillCategory[];
  onChange: (items: SkillCategory[]) => void;
}

export const SkillsSection: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newCategory: SkillCategory = {
      id: crypto.randomUUID(),
      categoryName: "",
      skills: [],
    };
    onChange([...items, newCategory]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleCategoryNameChange = (id: string, name: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, categoryName: name } : item))
    );
  };

  const handleSkillsChange = (id: string, skillsString: string) => {
    const skillList = skillsString.split(",").map((s) => s.trim());
    onChange(
      items.map((item) => (item.id === id ? { ...item, skills: skillList } : item))
    );
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Wrench className="h-4 w-4" /> Skill Category #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="Remove Skill Category"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium">Category Name</Label>
              <Input
                value={item.categoryName}
                onChange={(e) => handleCategoryNameChange(item.id, e.target.value)}
                placeholder="e.g. Programming Languages / Tools"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Skills (Comma Separated)</Label>
              <Input
                value={item.skills.join(", ")}
                onChange={(e) => handleSkillsChange(item.id, e.target.value)}
                placeholder="e.g. Python, React, TypeScript, Docker"
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
        <Plus className="h-4 w-4" /> Add Skill Category
      </Button>
    </div>
  );
};
