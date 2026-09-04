import React from "react";
import { WorkExperience } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Briefcase, ListPlus, X } from "lucide-react";

interface Props {
  items: WorkExperience[];
  onChange: (items: WorkExperience[]) => void;
}

export const ExperienceSection: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newEntry: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      bullets: [""],
    };
    onChange([...items, newEntry]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof WorkExperience, value: unknown) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleBulletChange = (id: string, bulletIndex: number, text: string) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;
        const newBullets = [...item.bullets];
        newBullets[bulletIndex] = text;
        return { ...item, bullets: newBullets };
      })
    );
  };

  const handleAddBullet = (id: string) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;
        return { ...item, bullets: [...item.bullets, ""] };
      })
    );
  };

  const handleRemoveBullet = (id: string, bulletIndex: number) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;
        return { ...item, bullets: item.bullets.filter((_, idx) => idx !== bulletIndex) };
      })
    );
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> Work Experience #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="Remove Entry"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium">Company Name</Label>
              <Input
                value={item.company}
                onChange={(e) => handleUpdate(item.id, "company", e.target.value)}
                placeholder="e.g. Google, Acme Inc"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Job Title / Role</Label>
              <Input
                value={item.position}
                onChange={(e) => handleUpdate(item.id, "position", e.target.value)}
                placeholder="e.g. Software Engineer"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Location</Label>
              <Input
                value={item.location}
                onChange={(e) => handleUpdate(item.id, "location", e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Start Date</Label>
              <Input
                value={item.startDate}
                onChange={(e) => handleUpdate(item.id, "startDate", e.target.value)}
                placeholder="e.g. Jan 2023"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">End Date</Label>
              <Input
                disabled={item.isCurrent}
                value={item.isCurrent ? "Present" : item.endDate}
                onChange={(e) => handleUpdate(item.id, "endDate", e.target.value)}
                placeholder="e.g. Dec 2024"
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id={`current-${item.id}`}
                checked={item.isCurrent}
                onCheckedChange={(checked) => handleUpdate(item.id, "isCurrent", Boolean(checked))}
              />
              <label htmlFor={`current-${item.id}`} className="text-xs font-medium cursor-pointer">
                I currently work here
              </label>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Responsibilities & Key Achievements</span>
              <button
                type="button"
                onClick={() => handleAddBullet(item.id)}
                className="text-primary hover:underline text-xs flex items-center gap-1 font-normal"
              >
                <ListPlus className="h-3.5 w-3.5" /> Add bullet point
              </button>
            </Label>
            {item.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">•</span>
                <Input
                  value={bullet}
                  onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                  placeholder="e.g. Led a team of 4 engineers to rebuild payment system..."
                  className="text-xs"
                />
                {item.bullets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(item.id, bIdx)}
                    className="text-muted-foreground hover:text-destructive p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed border-border hover:bg-accent text-sm font-semibold flex items-center justify-center gap-2 py-3"
      >
        <Plus className="h-4 w-4" /> Add Work Experience
      </Button>
    </div>
  );
};
