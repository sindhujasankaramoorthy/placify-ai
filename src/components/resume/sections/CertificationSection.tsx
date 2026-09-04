import React from "react";
import { Certification } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ShieldCheck } from "lucide-react";

interface Props {
  items: Certification[];
  onChange: (items: Certification[]) => void;
}

export const CertificationSection: React.FC<Props> = ({ items, onChange }) => {
  const handleAdd = () => {
    const newEntry: Certification = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      issueDate: "",
      url: "",
    };
    onChange([...items, newEntry]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Certification, value: string) => {
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
              <ShieldCheck className="h-4 w-4" /> Certification #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(item.id)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="Remove Certification"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium">Certification Name</Label>
              <Input
                value={item.name}
                onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Issuing Organization</Label>
              <Input
                value={item.issuer}
                onChange={(e) => handleUpdate(item.id, "issuer", e.target.value)}
                placeholder="e.g. Amazon Web Services"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Issue Date</Label>
              <Input
                value={item.issueDate}
                onChange={(e) => handleUpdate(item.id, "issueDate", e.target.value)}
                placeholder="e.g. Aug 2024"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Credential URL (Optional)</Label>
              <Input
                value={item.url}
                onChange={(e) => handleUpdate(item.id, "url", e.target.value)}
                placeholder="https://credly.com/..."
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
        <Plus className="h-4 w-4" /> Add Certification
      </Button>
    </div>
  );
};
