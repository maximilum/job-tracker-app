"use client";

import { useState } from "react";
import { JobApplication as Job, Column } from "../../lib/models/models.types";
import { deleteJobApplication } from "@/actions/jobApplication";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const santizedJobForm = {
      ...jobForm,
      tags: jobForm.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };
  }

  async function handleDelete(jobId: string) {
    console.log(jobId);
    try {
      const res = await deleteJobApplication(jobId);
    } catch (error) {}
  }

  return (
    <>
      {/* Pop Up Editing */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-w-max">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
            </DialogHeader>
            {/* Form Start */}
            <div>
              {/* Main Form */}
              <div className="grid grid-cols-2 justify-center items-start gap-4 ">
                {/* Company */}
                <div className="flex gap-2 items-center">
                  <label htmlFor="company" className="w-24">
                    Compnay*
                  </label>
                  <input
                    required
                    value={jobForm.company}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, company: e.target.value })
                    }
                    className="border-2 px-2 py-1"
                    name="company"
                    type="text"
                    placeholder="Apple, facebook, ..."
                  />
                </div>
                {/* Position */}
                <div className="flex gap-2 items-center">
                  <label htmlFor="position" className="w-24">
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
                    className="border-2 px-2 py-1"
                    placeholder="Software Engineer"
                  />
                </div>
                {/* Location */}
                <div className="flex gap-2 items-center">
                  <label htmlFor="location" className="w-24">
                    Location
                  </label>
                  <input
                    value={jobForm.location}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, location: e.target.value })
                    }
                    name="location"
                    type="text"
                    className="border-2 px-2 py-1"
                    placeholder="Riyadh, KSA"
                  />
                </div>
                {/* Status */}
                <div className="flex gap-2 items-center">
                  <label htmlFor="status" className="w-24">
                    Status
                  </label>
                  <input
                    value={jobForm.status}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, status: e.target.value })
                    }
                    name="status"
                    type="text"
                    className="border-2 px-2 py-1"
                    placeholder="applied"
                  />
                </div>
                {/* Salary */}

                <div className="flex gap-2 items-center">
                  <label htmlFor="salary" className="w-24">
                    Salary
                  </label>
                  <input
                    value={jobForm.salary}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, salary: e.target.value })
                    }
                    type="text"
                    name="salary"
                    className="border-2 px-2 py-1"
                    placeholder="10k"
                  />
                </div>
              </div>
              {/* Tags Section */}
              <div className="grid grid-cols-[77px_auto] items-center my-4">
                <label htmlFor="tags" className="w-24 ">
                  Tags
                </label>
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
                <p> </p>
                <p className="text-xs text-gray-400 font-light">
                  Make sure to seperate each tag with a comma
                </p>
              </div>
              {/* Description */}
              <div className=" my-4">
                <label htmlFor="description">Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, description: e.target.value })
                  }
                  name="description"
                  placeholder="Job Description..."
                  className="border-2 px-2 py-1 w-full"
                />
              </div>
              {/* Notes */}
              <div>
                <label htmlFor="notes">Notes</label>
                <textarea
                  value={jobForm.notes}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, notes: e.target.value })
                  }
                  name="description"
                  placeholder="Write your notes..."
                  className="border-2 px-2 py-1 w-full"
                />
              </div>
            </div>
            {/* Footer */}
            <DialogFooter>
              <div className="flex gap-2">
                <Button type="submit">Add</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ############################### */}
      {/* Job */}
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
                      <DropdownMenuItem key={col._id}>
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
              <p className="border-l-2 border-sky-200 pl-4 italic">
                {job.description}
              </p>
              <p className="">{job.notes}</p>
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
    </>
  );
};

export default JobApplication;
