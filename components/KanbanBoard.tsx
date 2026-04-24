"use client";

import { useRef, useState } from "react";
import { Board, Column } from "../lib/models/models.types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  createJobApplication,
  updateJobApplication,
} from "@/actions/jobApplication";
import { useSession } from "../lib/auth/auth-client";
import {
  MouseSensor,
  TouchSensor,
  DndContext,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragOverlay,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
} from "@dnd-kit/core";

import {
  Award,
  Calendar,
  CheckCircle2,
  CirclePlus,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import JobApplication from "../components/ui/JobApplication";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBoard } from "@/hooks/useBoard";
import JobApplicationModel from "@/lib/models/JobApplication.model";
import boardMutationQueue from "@/lib/mutationQueue";

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
//  ####################################################################################
// Droppable Column
const DroppableColumn = ({
  column,
  config,
  columns,
  boardId,
}: DroppableColumnProps) => {
  columns = columns.filter((col) => col._id !== column._id);
  const userId = useSession().data?.user?.id;

  // Dnd kit
  const { setNodeRef } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id,
    },
  });
  const items = column.jobApplications.map((job) => job._id);

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

  async function handleSubmit(e: React.SubmitEvent) {
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
    <Card className="p-0 min-w-106 h-full ">
      {/* Column -> Add Job Dialog */}
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

      {/* Column Header  */}
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

      {/* Column Body */}

      <CardContent className="pb-4 " ref={setNodeRef}>
        <div className="grid gap-4 ">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {column.jobApplications.map((job) => {
              return (
                <JobApplication
                  key={job._id}
                  job={job}
                  columns={columns}
                ></JobApplication>
              );
            })}
          </SortableContext>

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
  boardDoc: Board;
}
const KanbanBoard = ({ boardDoc }: KanbanBoardProps) => {
  const { board, moveJob } = useBoard(boardDoc);
  console.log(board);
  const sortedColumns = board.columns;
  // To store the updates to send to the database after the drag is complete
  const updatesRef = useRef<
    | {
        jobId: string | number;
        newColumnId: string | undefined;
        order: number | undefined;
      }
    | undefined
  >(null);

  // DnD Kit
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }
  function handleDragOver(event: DragOverEvent) {
    const activeJobId = event.active?.id as string;
    const targetId = event.over?.id as string;

    if (!activeJobId || !targetId) return;

    const activeColumn = sortedColumns.find((col) =>
      col.jobApplications.some((job) => job._id === activeJobId),
    );
    const targetColumn = sortedColumns.find(
      (col) =>
        col._id === targetId ||
        col.jobApplications.some((job) => job._id === targetId),
    );

    if (!activeColumn || !targetColumn) return;

    // Only update state during drag if crossing columns
    if (activeColumn._id !== targetColumn._id) {
      updatesRef.current = moveJob(activeJobId, targetId);
    }
  }
  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const activeJobId = event.active?.id as string;
    const targetId = event.over?.id as string;
    if (!activeJobId || !targetId) return;

    const activeColumn = sortedColumns.find((col) =>
      col.jobApplications.some((job) => job._id === activeJobId),
    );
    const targetColumn = sortedColumns.find(
      (col) =>
        col._id === targetId ||
        col.jobApplications.some((job) => job._id === targetId),
    );

    if (activeColumn?._id === targetColumn?._id) {
      const result = moveJob(activeJobId, targetId);
      if (result) {
        updatesRef.current = result;
      }
    }
    console.log("updates : ", updatesRef.current);
    const currentUpdates = updatesRef.current;
    if (currentUpdates) {
      boardMutationQueue.enqueue(async () => {
        updateJobApplication({
          jobId: String(currentUpdates.jobId),
          columnId: currentUpdates.newColumnId as string,
          order: currentUpdates.order as number,
        });
      });
      // Clear the ref after processing
      updatesRef.current = undefined;
    }
  }
  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === activeId);
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 3,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <div className="flex gap-4 overflow-x-scroll pb-16">
      <DndContext
        id="kanban-board-dnd-context"
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
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
        <DragOverlay>
          {activeJob ? (
            <div className="opacity-50">
              <JobApplication job={activeJob} columns={sortedColumns} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
