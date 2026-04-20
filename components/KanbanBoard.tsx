"use client";

import { useState } from "react";
import { Board, Column } from "../lib/models/models.types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { createJobApplication } from "@/actions/jobApplication";
import { useSession } from "../lib/auth/auth-client";

import {
  Award,
  Calendar,
  CheckCircle2,
  CirclePlus,
  Columns,
  EllipsisVertical,
  Mic,
  Plus,
  Trash,
  XCircle,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import JobApplication from "../components/ui/JobApplication";

interface ColConfig {
  color: string;
  icon: React.ReactNode;
}
const COLUMN_CONFIG: Array<ColConfig> = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-6 w-6" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-6 w-6" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-6 w-6" />,
  },
];

//  ####################################################################################
// Droppable Column

interface DroppableColumnProps {
  column: Column;
  config: ColConfig;
  columns: Column[];
  boardId: string;
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

const DroppableColumn = ({
  column,
  config,
  columns,
  boardId,
}: DroppableColumnProps) => {
  columns = columns.filter((col) => col._id !== column._id);
  const userId = useSession().data?.user?.id;

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const [jobForm, setJobForm] = useState<jobFormInterface>({
    company: "",
    position: "",
    location: "",
    status: "",
    notes: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const santizedJobForm = {
      ...jobForm,
      tags: jobForm.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      userId: userId,
      boardId: boardId,
      columnId: column._id,
    };
    const res = await createJobApplication(santizedJobForm);
    if (res.error) {
      setError(res.error);
    } else {
      setIsOpen(false);
    }
  }

  return (
    <Card className="p-0 min-w-106 max-h-max ">
      {/* Add Job Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-w-max">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-4">
              <DialogTitle>Add job to {column.name}</DialogTitle>
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
            <div className="flex justify-between w-full mt-8">
              <div>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setJobForm({
                      company: "",
                      position: "",
                      location: "",
                      status: "",
                      salary: "",
                      notes: "",
                      jobUrl: "",
                      tags: "",
                      description: "",
                    });
                    setError("");
                  }}
                >
                  Clear Form
                </Button>
              </div>
              <div className="flex gap-2">
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit">Add</Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header  */}
      <CardHeader className="p-0">
        <div
          className={`w-full h-16 px-8 ${config.color} flex justify-between items-center`}
        >
          <CardTitle>
            <div className="text-white p-4 flex gap-4 justify-between items-center">
              <span className="">{config.icon}</span>
              <span>{column.name}</span>
            </div>
          </CardTitle>
          <div>
            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical className="text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <div
                    className=" flex items-center gap-3 px-4"
                    onClick={() => setIsOpen(true)}
                  >
                    <span>
                      <Plus className="" />
                    </span>
                    Add Job
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className=" flex items-center gap-3 px-4 text-destructive">
                    <span>
                      <Trash className="text-destructive" />
                    </span>
                    Delete
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Body */}

      <CardContent className="pb-4 ">
        <div className="grid gap-4 ">
          {column.jobApplications.map((job) => {
            return (
              <JobApplication
                key={job._id}
                job={job}
                columns={columns}
              ></JobApplication>
            );
          })}
          <div
            className="flex justify-center items-center gap-4 border-dashed border-2 py-2 hover:bg-muted"
            onClick={() => setIsOpen(true)}
          >
            <CirclePlus />
            <span>Add Job</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ############################################################################
// Main kanban board
interface KanbanBoardProps {
  board: Board;
}
const KanbanBoard = ({ board }: KanbanBoardProps) => {
  const sortedColumns: Column[] = board.columns.sort(
    (a, b) => a.order - b.order,
  );
  return (
    <div className="flex gap-4 overflow-x-scroll pb-16">
      {sortedColumns.map((col, key) => {
        const config = COLUMN_CONFIG[key];
        return (
          <DroppableColumn
            key={col._id}
            column={col}
            config={config}
            columns={sortedColumns}
            boardId={board._id}
          ></DroppableColumn>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
