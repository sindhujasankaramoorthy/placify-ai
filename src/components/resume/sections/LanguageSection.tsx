import React from "react";
import { Language } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Languages } from "lucide-react";

interface Props {
  items: Language[];
  onChange: (items: Language[]) => void;
}

export const LanguageSection: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newEntry: Language = {
      id: crypto.randomUUID(),
      language: "",
      proficiency: "",
    };
    onChange([...items, newEntry]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Language, value: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Languages className="h-4 w-4" /> Language #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="Remove Language"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium">Language</Label>
              <Input
                value={item.language}
                onChange={(e) => handleUpdate(item.id, "language", e.target.value)}
                placeholder="e.g. English, Spanish, French"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Proficiency Level</Label>
              <Input
                value={item.proficiency}
                onChange={(e) => handleUpdate(item.id, "proficiency", e.target.value)}
                placeholder="e.g. Native, Full Professional, Conversational"
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
        <Plus className="h-4 w-4" /> Add Language
      </Button>
    </div>
  );
};
