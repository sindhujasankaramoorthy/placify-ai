import React, { useState, useEffect } from "react";
import {
  fetchUserResumes,
  deleteResume,
  ApiResumeResponse,
} from "@/lib/api/resume";
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
import { FolderOpen, Plus, Trash2, Calendar, FileText, Loader2, Check } from "lucide-react";

interface Props {
  currentResumeId: number | string | null;
  onSelectResume: (resume: ApiResumeResponse) => void;
  onCreateNew: () => void;
}

export const ResumeListDialog: React.FC<Props> = ({
  currentResumeId,
  onSelectResume,
  onCreateNew,
}) => {
  const [open, setOpen] = useState(false);
  const [resumes, setResumes] = useState<ApiResumeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const data = await fetchUserResumes();
      setResumes(data);
    } catch (err) {
      console.error("Failed to load resumes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadResumes();
    }
  }, [open]);

  const handleDelete = async (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this saved resume?")) {
      setDeletingId(id);
      try {
        await deleteResume(id);
        setResumes((prev) => prev.filter((r) => String(r.id) !== String(id)));
      } catch (err) {
        console.error("Failed to delete resume", err);
        alert("Failed to delete resume");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSelect = (resume: ApiResumeResponse) => {
    onSelectResume(resume);
    setOpen(false);
  };

  const handleNew = () => {
    onCreateNew();
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
          <FolderOpen className="h-4 w-4 text-primary" />
          <span>My Saved Resumes</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" /> Saved Resumes
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Switch between your saved resume versions or create a fresh new draft.
              </DialogDescription>
            </div>
            <Button
              size="sm"
              onClick={handleNew}
              className="btn-gradient text-xs gap-1.5 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> New Blank Resume
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs">Loading your saved resumes...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="py-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3 bg-muted/20">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">No Saved Resumes Found</h4>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
                  Click "New Blank Resume" or use the Save button in the builder to create your first resume version.
                </p>
              </div>
              <Button size="sm" onClick={handleNew} className="text-xs gap-1.5 mt-2">
                <Plus className="h-3.5 w-3.5" /> Create New Resume
              </Button>
            </div>
          ) : (
            <div className="grid gap-2.5">
              {resumes.map((resume) => {
                const isActive = String(resume.id) === String(currentResumeId);
                const dateString = resume.updated_at
                  ? new Date(resume.updated_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Recently";

                return (
                  <div
                    key={resume.id}
                    onClick={() => handleSelect(resume)}
                    className={`rounded-xl border p-3.5 cursor-pointer transition-all flex items-center justify-between group hover:shadow-sm ${
                      isActive
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {resume.title || "Untitled Resume"}
                          </h4>
                          {isActive && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0 gap-0.5">
                              <Check className="h-2.5 w-2.5" /> Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {dateString}
                          </span>
                          <span className="capitalize px-1.5 py-0.2 bg-muted rounded text-[10px] font-medium text-foreground">
                            {resume.template_id || "modern-pro"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === resume.id}
                        onClick={(e) => handleDelete(e, resume.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        title="Delete saved resume"
                      >
                        {deletingId === resume.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
