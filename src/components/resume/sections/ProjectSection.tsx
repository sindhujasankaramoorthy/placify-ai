import React from "react";
import { Project } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FolderGit2, ListPlus, X } from "lucide-react";

interface Props {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export const ProjectSection: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newEntry: Project = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      technologies: [],
      githubLink: "",
      liveLink: "",
      bullets: [""],
    };
    onChange([...items, newEntry]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Project, value: unknown) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleTechChange = (id: string, techString: string) => {
    const techArray = techString.split(",").map((t) => t.trim());
    handleUpdate(id, "technologies", techArray);
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
              <FolderGit2 className="h-4 w-4" /> Project #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="Remove Project"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium">Project Title</Label>
              <Input
                value={item.title}
                onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                placeholder="e.g. AI Resume Builder"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Technologies Used (Comma Separated)</Label>
              <Input
                value={item.technologies.join(", ")}
                onChange={(e) => handleTechChange(item.id, e.target.value)}
                placeholder="e.g. React, TypeScript, FastAPI, Tailwind"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">GitHub Repository URL</Label>
              <Input
                value={item.githubLink}
                onChange={(e) => handleUpdate(item.id, "githubLink", e.target.value)}
                placeholder="https://github.com/user/project"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Live Demo URL</Label>
              <Input
                value={item.liveLink}
                onChange={(e) => handleUpdate(item.id, "liveLink", e.target.value)}
                placeholder="https://myproject.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Short Project Summary</Label>
            <Textarea
              value={item.description}
              onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
              placeholder="Brief overview of what the project does..."
              rows={2}
              className="mt-1 text-xs"
            />
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Key Features & Contributions</span>
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
                  placeholder="e.g. Implemented real-time dynamic preview rendering..."
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
        <Plus className="h-4 w-4" /> Add Project
      </Button>
    </div>
  );
};
