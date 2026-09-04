import React, { useState } from "react";
import { RESUME_TEMPLATES } from "./templates/templateRegistry";
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
import { LayoutTemplate, Check, Sparkles, CheckCircle2 } from "lucide-react";

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

  const selectedTemplate =
    RESUME_TEMPLATES.find((t) => t.id === selectedTemplateId) || RESUME_TEMPLATES[0];

  const handleSelect = (id: string) => {
    onSelectTemplate(id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs font-semibold bg-card hover:bg-accent border-border"
        >
          <LayoutTemplate className="h-4 w-4 text-primary" />
          <span>
            Template: <strong className="text-foreground">{selectedTemplate.name}</strong>
          </span>
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
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="text-xs h-7 px-3"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {filteredTemplates.map((template) => {
            const isSelected = template.id === selectedTemplateId;
            return (
              <div
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between group hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {template.category}
                    </span>
                    {template.isAtsFriendly && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                        ATS Score 95+
                      </Badge>
                    )}
                  </div>

                  {/* Thumbnail / Mock Preview Box */}
                  <div className="h-28 w-full rounded-lg bg-muted/70 border border-border/80 p-2.5 flex flex-col justify-between overflow-hidden mb-3 relative group-hover:bg-muted transition-colors">
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-1/2 bg-foreground/20 rounded-full" />
                      <div className="h-1.5 w-3/4 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-1.5 bg-foreground/10 rounded-full" />
                      <div className="h-1.5 bg-foreground/10 rounded-full" />
                      <div className="h-1.5 bg-foreground/10 rounded-full" />
                      <div className="h-1.5 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-foreground/15 rounded-full" />
                      <div className="h-1.5 w-2/3 bg-foreground/10 rounded-full" />
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] flex items-center justify-center">
                        <Badge className="gap-1 bg-primary text-primary-foreground text-xs shadow-sm">
                          <Check className="h-3.5 w-3.5" /> Active
                        </Badge>
                      </div>
                    )}
                  </div>

                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    {template.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {template.columns === 2 ? "Two Column" : "Single Column"}
                  </span>
                  <Button
                    size="sm"
                    variant={isSelected ? "secondary" : "outline"}
                    className="text-xs h-7 gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(template.id);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-primary" /> Selected
                      </>
                    ) : (
                      "Apply Layout"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
