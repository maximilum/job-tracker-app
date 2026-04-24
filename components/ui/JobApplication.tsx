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
  updateJobApplication,
} from "@/actions/jobApplication";
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
interface jobFormInterface {
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
  // States

  // card info expanded
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Dnd Kit
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
    opacity: isDragging ? 0.5 : 1,
  };

  //   Edit Job State
  const [isOpen, setIsOpen] = useState(false);
  const [jobForm, setJobForm] = useState<jobFormInterface>({
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
  async function handleDelete(jobId: string) {
    console.log(jobId);
    try {
      const res = await deleteJobApplication(jobId);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleEditing(
    e: React.FormEvent,
    jobId: string,
    newColumnId: string,
  ) {
    e.preventDefault();
    const sanitizedJobForm = {
      ...jobForm,
      tags: jobForm.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };
    const updates = { ...sanitizedJobForm, jobId, columnId: newColumnId };
    const res = await updateJobApplication(updates);
    if (res.success) setIsOpen(false);
  }
  async function handleMoveToNewColumn(
    e: React.MouseEvent,
    jobId: string,
    newColumnId: string,
  ) {
    e.preventDefault();
    const updates = { jobId, columnId: newColumnId };
    console.log(updates);
    await updateJobApplication(updates);
    return;
  }

  return (
    <>
      {/* Pop Up Editing */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <form onSubmit={(e) => handleEditing(e, job._id, job.columnId)}>
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
            </DialogHeader>
            {/* Form Start */}
            <div className="mt-4">
              {/* Main Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-start gap-4">
                {/* Company */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="company" className="w-24 shrink-0">
                    Company*
                  </label>
                  <input
                    required
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, company: e.target.value })
                    }
                    className="border-2 px-2 py-1 w-full"
                    name="company"
                    type="text"
                    placeholder="Apple, facebook, ..."
                  />
                </div>
                {/* Position */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="position" className="w-24 shrink-0">
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
                    className="border-2 px-2 py-1 w-full"
                    placeholder="Software Engineer"
                  />
                </div>
                {/* Location */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="location" className="w-24 shrink-0">
                    Location
                  </label>
                  <input
                    value={jobForm.location}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, location: e.target.value })
                    }
                    name="location"
                    type="text"
                    className="border-2 px-2 py-1 w-full"
                    placeholder="Riyadh, KSA"
                  />
                </div>
                {/* Status */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="status" className="w-24 shrink-0">
                    Status
                  </label>
                  <input
                    value={jobForm.status}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, status: e.target.value })
                    }
                    name="status"
                    type="text"
                    className="border-2 px-2 py-1 w-full"
                    placeholder="applied"
                  />
                </div>
                {/* Salary */}
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                  <label htmlFor="salary" className="w-24 shrink-0">
                    Salary
                  </label>
                  <input
                    value={jobForm.salary}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, salary: e.target.value })
                    }
                    type="text"
                    name="salary"
                    className="border-2 px-2 py-1 w-full"
                    placeholder="10k"
                  />
                </div>
              </div>
              {/* Tags Section */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start my-4">
                <label htmlFor="tags" className="w-24 shrink-0 sm:mt-1">
                  Tags
                </label>
                <div className="w-full">
                  <input
                    value={jobForm.tags}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        tags: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="React, Next JS, FrontEnd"
                    name="tags"
                    className="border-2 px-2 py-1 w-full"
                  />
                  <p className="text-xs text-gray-400 font-light mt-1">
                    Make sure to seperate each tag with a comma
                  </p>
                </div>
              </div>
              {/* Description */}
              <div className="my-4 flex flex-col gap-1">
                <label htmlFor="description">Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, description: e.target.value })
                  }
                  name="description"
                  placeholder="Job Description..."
                  className="border-2 px-2 py-1 w-full"
                  rows={4}
                />
              </div>
              {/* Notes */}
              <div className="flex flex-col gap-1">
                <label htmlFor="notes">Notes</label>
                <textarea
                  value={jobForm.notes}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, notes: e.target.value })
                  }
                  name="notes"
                  placeholder="Write your notes..."
                  className="border-2 px-2 py-1 w-full"
                  rows={3}
                />
              </div>
            </div>
            {/* Footer */}
            <DialogFooter className="mt-6">
              <div className="flex justify-end gap-2 w-full">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Edit</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* #################################################################################### */}
      {/* #################################################################################### */}
      {/* Job */}
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card
          key={job._id}
          className="py-2 pb-4 px-8 gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardHeader className="p-0">
            <div className="text-md w-full flex justify-between">
              <CardTitle>
                <h2
                  className=" text-primary font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  {job.position}
                </h2>
                <h3
                  className="font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  {job.company}
                </h3>
              </CardTitle>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem
                      className=""
                      onSelect={(e) => {
                        e.preventDefault();
                        setIsOpen(true);
                      }}
                    >
                      <div className="flex gap-4 items-center">
                        <span>
                          <SquarePen size={28} />
                        </span>
                        <p className="">Edit</p>
                      </div>
                    </DropdownMenuItem>
                    {columns.map((col) => {
                      return (
                        <DropdownMenuItem
                          key={col._id}
                          onClick={(e) => {
                            handleMoveToNewColumn(e, job._id, col._id);
                          }}
                        >
                          <div>
                            <span>Move to {col.name}</span>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuItem onClick={() => handleDelete(job._id)}>
                      <div className="flex gap-4 items-center">
                        <span>
                          <Trash className="text-destructive" />
                        </span>
                        <p className="text-destructive">Delete</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </div>
          </CardHeader>
          <CardDescription>
            <div className="flex gap-3 text-xs text-gray-500">
              <div
                className="flex justify-center items-center gap-1 "
                onClick={(e) => e.stopPropagation()}
              >
                {job.salary && (
                  <>
                    <CircleDollarSign size={16} />
                    <span>{job.salary}</span>
                  </>
                )}
              </div>
              <div
                className="flex justify-center items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {job.location && (
                  <>
                    <LocateFixed size={16} />
                    <span>{job.location}</span>
                  </>
                )}
              </div>
              <div className="flex gap-1"></div>
            </div>
          </CardDescription>
          <CardContent className="px-0">
            <div
              className={`grid transition-all duration-300 ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} my-4`}
            >
              <div className="overflow-hidden text-xs">
                <p className="border-l-2 border-sky-200 pl-4 italic mb-8">
                  {job.description}
                </p>
                {job.notes && <p className="">{job.notes}</p>}
              </div>
            </div>
            <div className="flex gap-2 p-0 flex-wrap">
              {job.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="hover:bg-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default JobApplication;
