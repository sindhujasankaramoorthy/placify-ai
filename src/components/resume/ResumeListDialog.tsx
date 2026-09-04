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
import { FolderOpen, Plus, Trash2, Calendar, FileText, Loader2 } from "lucide-react";

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
      console.error(err);
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
        <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold bg-card hover:bg-accent border-border">
          <FolderOpen className="h-4 w-4 text-primary" /> My Resumes
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Saved Resumes
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Open, manage, or delete your saved resume documents from the FastAPI database.
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {resumes.length} {resumes.length === 1 ? "resume" : "resumes"} found
          </span>
          <Button size="sm" onClick={handleNew} className="gap-1.5 text-xs font-semibold">
            <Plus className="h-3.5 w-3.5" /> Create Blank Resume
          </Button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            Loading saved resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground border border-dashed border-border rounded-xl p-6 text-xs space-y-2">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <p className="font-medium text-foreground">No saved resumes found in database.</p>
            <p>Click "Create Blank Resume" or save your current resume above.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {resumes.map((resume) => {
              const isCurrent = String(resume.id) === String(currentResumeId);
              const formattedDate = new Date(resume.updated_at || resume.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={resume.id}
                  onClick={() => handleSelect(resume)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between hover:shadow-sm ${
                    isCurrent
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{resume.title || "Untitled Resume"}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-primary/20 text-primary font-semibold px-2 py-0.5 rounded-full">
                          Currently Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="capitalize">Template: {resume.template_id}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Updated {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(e, resume.id)}
                      disabled={deletingId === resume.id}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title="Delete Resume"
                    >
                      {deletingId === resume.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
