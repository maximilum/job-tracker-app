"use client";

import { useState } from "react";
import type {
  JobApplication as Job,
  Column,
} from "../../lib/models/models.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  deleteJobApplication,
  moveJobToColumn,
  updateJobFields,
} from "@/actions/jobApplication";
import boardMutationQueue from "@/lib/mutationQueue";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  CircleDollarSign,
  EllipsisVertical,
  LocateFixed,
  SquarePen,
  Trash,
  GripVertical,
} from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import JobForm, { JobFormData } from "../JobForm";

interface JobApplicationProps {
  job: Job;
  columns: Column[];
}

const JobApplication = ({ job, columns }: JobApplicationProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // DnD Kit Sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job._id.toString(),
    data: {
      type: "job",
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Edit Job Dialog state with unified JobForm (Fixes Bug 5.5)
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  function handleDelete(jobId: string) {
    if (typeof window !== "undefined" && !window.confirm("Are you sure you want to delete this job application?")) {
      return;
    }
    boardMutationQueue.enqueue(
      async () => {
        await deleteJobApplication(jobId);
      },
      { key: String(jobId) },
    );
  }

  async function handleEditing(formData: JobFormData) {
    setIsSubmitting(true);
    setEditError("");
    try {
      const sanitizedJobForm = {
        ...formData,
        tags: formData.tags
          ?.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      const res = await updateJobFields({ jobId: job._id, ...sanitizedJobForm });
      if (res.success) {
        setIsOpen(false);
      } else {
        setEditError(res.error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleMoveToNewColumn(
    e: React.MouseEvent,
    jobId: string,
    newColumnId: string,
  ) {
    e.preventDefault();
    boardMutationQueue.enqueue(
      async () => {
        await moveJobToColumn({ jobId, targetColumnId: newColumnId });
      },
      { key: String(jobId) },
    );
  }

  return (
    <>
      {/* Pop Up Editing Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit Job Details</DialogTitle>
          </DialogHeader>

          <JobForm
            key={job._id}
            initialData={{
              company: job.company,
              position: job.position,
              location: job.location,
              status: job.status,
              notes: job.notes,
              salary: job.salary,
              jobUrl: job.jobUrl,
              tags: job.tags?.join(", "),
              description: job.description,
            }}
            submitLabel="Save Changes"
            isSubmitting={isSubmitting}
            error={editError}
            onCancel={() => setIsOpen(false)}
            onSubmit={handleEditing}
          />
        </DialogContent>
      </Dialog>

      {/* Main Sortable Card Container */}
      <div ref={setNodeRef} style={style}>
        <Card
          className="py-2 pb-4 px-4 gap-2 border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardHeader className="p-0">
            <div className="text-md w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Dedicated Drag Handle with GripVertical (Fixes Addendum #2) */}
                <button
                  type="button"
                  aria-label="Drag job card"
                  className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none p-1 rounded hover:bg-muted"
                  {...attributes}
                  {...listeners}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical size={16} />
                </button>

                <CardTitle>
                  <h2 className="text-primary font-semibold text-sm">
                    {job.position}
                  </h2>
                  <h3 className="font-semibold text-xs text-muted-foreground">
                    {job.company}
                  </h3>
                </CardTitle>
              </div>

              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EllipsisVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setIsOpen(true);
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <SquarePen size={16} />
                        <span>Edit</span>
                      </div>
                    </DropdownMenuItem>

                    {columns.map((col) => {
                      if (col._id === job.columnId) return null;
                      return (
                        <DropdownMenuItem
                          key={col._id}
                          onClick={(e) => {
                            handleMoveToNewColumn(e, job._id, col._id);
                          }}
                        >
                          <span>Move to {col.name}</span>
                        </DropdownMenuItem>
                      );
                    })}

                    <DropdownMenuItem
                      onClick={() => handleDelete(job._id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <div className="flex gap-2 items-center">
                        <Trash size={16} />
                        <span>Delete</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </div>
          </CardHeader>

          <CardDescription>
            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
              {job.salary && (
                <div className="flex items-center gap-1">
                  <CircleDollarSign size={14} />
                  <span>{job.salary}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-1">
                  <LocateFixed size={14} />
                  <span>{job.location}</span>
                </div>
              )}
            </div>
          </CardDescription>

          <CardContent className="px-0 pb-0">
            <div
              className={`grid transition-all duration-300 ${
                isExpanded ? "grid-rows-[1fr] my-3" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden text-xs space-y-2">
                {job.description && (
                  <p className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground">
                    {job.description}
                  </p>
                )}
                {job.notes && (
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Notes: </span>
                    {job.notes}
                  </p>
                )}
                {job.jobUrl && (
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Job Posting
                  </a>
                )}
              </div>
            </div>

            {job.tags && job.tags.length > 0 && (
              <div className="flex gap-1.5 p-0 flex-wrap mt-2">
                {job.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default JobApplication;
