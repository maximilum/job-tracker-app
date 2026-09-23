"use client";

import { useState, useEffect } from "react";
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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobApplicationProps {
  job: Job;
  columns: Column[];
}

interface JobFormInterface {
  company: string;
  position: string;
  location?: string;
  status: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string;
  description?: string;
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

  // Edit Job State & sync with props (Fixes Bug 5.5)
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobForm, setJobForm] = useState<JobFormInterface>({
    company: job.company,
    position: job.position,
    location: job.location,
    status: job.status,
    notes: job.notes,
    salary: job.salary,
    jobUrl: job.jobUrl,
    tags: job.tags?.join(", "),
    description: job.description,
  });

  useEffect(() => {
    setJobForm({
      company: job.company,
      position: job.position,
      location: job.location,
      status: job.status,
      notes: job.notes,
      salary: job.salary,
      jobUrl: job.jobUrl,
      tags: job.tags?.join(", "),
      description: job.description,
    });
  }, [job]);

  function handleDelete(jobId: string) {
    boardMutationQueue.enqueue(
      async () => {
        await deleteJobApplication(jobId);
      },
      { key: String(jobId) },
    );
  }

  async function handleEditing(e: React.FormEvent, jobId: string) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const sanitizedJobForm = {
        ...jobForm,
        tags: jobForm.tags
          ?.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      const res = await updateJobFields({ jobId, ...sanitizedJobForm });
      if (res.success) {
        setIsOpen(false);
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
          <form onSubmit={(e) => void handleEditing(e, job._id)}>
            <DialogHeader>
              <DialogTitle>Edit Job Details</DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-start gap-4">
                {/* Company */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="company" className="w-24 shrink-0 text-sm">
                    Company*
                  </label>
                  <input
                    required
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, company: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full text-sm"
                    name="company"
                    type="text"
                    placeholder="Apple, Google, ..."
                  />
                </div>

                {/* Position */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="position" className="w-24 shrink-0 text-sm">
                    Position*
                  </label>
                  <input
                    required
                    value={jobForm.position}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, position: e.target.value })
                    }
                    name="position"
                    type="text"
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="Software Engineer"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="location" className="w-24 shrink-0 text-sm">
                    Location
                  </label>
                  <input
                    value={jobForm.location || ""}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, location: e.target.value })
                    }
                    name="location"
                    type="text"
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="Riyadh, Remote, ..."
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="status" className="w-24 shrink-0 text-sm">
                    Status
                  </label>
                  <input
                    value={jobForm.status}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, status: e.target.value })
                    }
                    name="status"
                    type="text"
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="applied"
                  />
                </div>

                {/* Salary */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="salary" className="w-24 shrink-0 text-sm">
                    Salary
                  </label>
                  <input
                    value={jobForm.salary || ""}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, salary: e.target.value })
                    }
                    type="text"
                    name="salary"
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="10k - 15k"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start my-4">
                <label htmlFor="tags" className="w-24 shrink-0 sm:mt-1 text-sm">
                  Tags
                </label>
                <div className="w-full">
                  <input
                    value={jobForm.tags || ""}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        tags: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="React, Next.js, Frontend"
                    name="tags"
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </div>

              {/* URL */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center my-4">
                <label htmlFor="url" className="w-24 shrink-0 text-sm">
                  Job URL
                </label>
                <input
                  value={jobForm.jobUrl || ""}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, jobUrl: e.target.value })
                  }
                  type="text"
                  name="url"
                  className="border rounded px-2 py-1 w-full text-sm"
                  placeholder="https://..."
                />
              </div>

              {/* Description */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start my-4">
                <label htmlFor="description" className="w-24 shrink-0 sm:mt-1 text-sm">
                  Description
                </label>
                <textarea
                  value={jobForm.description || ""}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, description: e.target.value })
                  }
                  name="description"
                  className="border rounded px-2 py-1 w-full text-sm"
                  rows={3}
                  placeholder="Job details, requirements, etc."
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start my-4">
                <label htmlFor="notes" className="w-24 shrink-0 sm:mt-1 text-sm">
                  Notes
                </label>
                <textarea
                  value={jobForm.notes || ""}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, notes: e.target.value })
                  }
                  name="notes"
                  className="border rounded px-2 py-1 w-full text-sm"
                  rows={2}
                  placeholder="Recruiter contact, interview prep..."
                />
              </div>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
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
