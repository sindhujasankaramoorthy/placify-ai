import React from "react";
import { Achievement } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Trophy } from "lucide-react";

interface Props {
  items: Achievement[];
  onChange: (items: Achievement[]) => void;
}

export const AchievementSection: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newEntry: Achievement = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      date: "",
    };
    onChange([...items, newEntry]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Achievement, value: string) => {
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
              <Trophy className="h-4 w-4" /> Achievement #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="Remove Achievement"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium">Achievement Title</Label>
              <Input
                value={item.title}
                onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                placeholder="e.g. 1st Place National Hackathon"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Date / Year</Label>
              <Input
                value={item.date}
                onChange={(e) => handleUpdate(item.id, "date", e.target.value)}
                placeholder="e.g. Nov 2024"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Description</Label>
            <Textarea
              value={item.description}
              onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
              placeholder="Brief description of award or honor..."
              rows={2}
              className="mt-1 text-xs"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed border-border hover:bg-accent text-sm font-semibold flex items-center justify-center gap-2 py-3"
      >
        <Plus className="h-4 w-4" /> Add Achievement
      </Button>
    </div>
  );
};
