import React, { useState } from "react";
import { RESUME_TEMPLATES, TemplateMetadata } from "./templates/templateRegistry";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutTemplate, Check, Sparkles } from "lucide-react";

interface Props {
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
}

export const TemplateSelector: React.FC<Props> = ({
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Modern", "Classic", "Technical", "Creative", "Executive"];

  const filteredTemplates = RESUME_TEMPLATES.filter(
    (t) => activeCategory === "All" || t.category === activeCategory
  );

  const selectedTemplate = RESUME_TEMPLATES.find((t) => t.id === selectedTemplateId) || RESUME_TEMPLATES[0];

  const handleSelect = (id: string) => {
    onSelectTemplate(id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold bg-card hover:bg-accent border-border">
          <LayoutTemplate className="h-4 w-4 text-primary" />
          <span>Template: <strong className="text-foreground">{selectedTemplate.name}</strong></span>
          <Sparkles className="h-3 w-3 text-amber-500 ml-1" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" /> Choose Resume Template
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select one of 10 professional layout designs. Your resume data will immediately adapt without losing any information.
          </DialogDescription>
        </DialogHeader>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 my-3 border-b border-border pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            const isSelected = template.id === selectedTemplateId;
            return (
              <div
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={`group relative rounded-xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {template.name}
                    </h4>
                    {template.badge && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {template.badge}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {template.description}
                  </p>
                </div>

                {/* Generic Structural Layout Thumbnail representation */}
                <div className="w-full h-24 rounded-lg bg-muted/60 border border-border/80 p-2.5 flex flex-col justify-between mb-3 overflow-hidden">
                  <div className="w-1/2 h-2.5 bg-primary/40 rounded" />
                  <div className="w-full h-1 bg-border rounded" />
                  <div className="space-y-1">
                    <div className="w-3/4 h-1.5 bg-foreground/20 rounded" />
                    <div className="w-full h-1.5 bg-foreground/15 rounded" />
                    <div className="w-5/6 h-1.5 bg-foreground/15 rounded" />
                  </div>
                  <div className="w-1/3 h-1.5 bg-primary/30 rounded" />
                </div>

                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="w-full text-xs font-semibold gap-1.5"
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Selected
                    </>
                  ) : (
                    "Use Template"
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
