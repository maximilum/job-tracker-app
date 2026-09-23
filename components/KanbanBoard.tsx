"use client";

import { useState } from "react";
import { Board, Column } from "../lib/models/models.types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  createJobApplication,
  moveJobToColumn,
} from "@/actions/jobApplication";
import {
  MouseSensor,
  TouchSensor,
  DndContext,
  useDroppable,
  useSensor,
  useSensors,
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
  XCircle,
} from "lucide-react";
import {
  Dialog,
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
import JobApplicationCard from "../components/ui/JobApplicationCard";
import JobForm, { JobFormData } from "./JobForm";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBoard } from "@/hooks/useBoard";
import boardMutationQueue from "@/lib/mutationQueue";

interface ColConfig {
  color: string;
  icon: React.ReactNode;
}

// Config mapping with positional modulo fallback (Fixes Addendum #4)
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

//  ####################################################################################
// Droppable Column
//  ####################################################################################
const DroppableColumn = ({
  column,
  config,
  columns,
  boardId,
}: DroppableColumnProps) => {
  // Avoid reassigning prop parameter (Fixes Bug 5.6)
  const otherColumns = columns.filter((col) => col._id !== column._id);

  const { setNodeRef } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id,
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: JobFormData) {
    setError("");
    setIsSubmitting(true);
    try {
      const sanitizedJobForm = {
        ...formData,
        tags: formData.tags
          ?.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        boardId: boardId,
        columnId: column._id,
      };

      const res = await createJobApplication(sanitizedJobForm);
      if (!res.success) {
        setError(res.error.message);
      } else {
        setIsOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-0 min-w-80 md:min-w-96 h-full flex flex-col">
      {/* Column -> Add Job Dialog with Unified JobForm (Fixes Bug 5.5) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-2">
            <DialogTitle>Add job to {column.name}</DialogTitle>
          </DialogHeader>

          <JobForm
            submitLabel="Add Job"
            isSubmitting={isSubmitting}
            error={error}
            onCancel={() => setIsOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Column Header */}
      <CardHeader className="border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`p-1 rounded-md text-white ${config.color}`}>
              {config.icon}
            </span>
            <CardTitle className="text-base font-semibold">
              {column.name}
            </CardTitle>
            <span className="text-xs bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-full">
              {column.jobApplications.length}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <EllipsisVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                Add Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Column Droppable Body */}
      <CardContent ref={setNodeRef} className="p-3 flex-1 overflow-y-auto space-y-3">
        <SortableContext
          items={column.jobApplications.map((j) => j._id)}
          strategy={verticalListSortingStrategy}
        >
          {column.jobApplications.map((job) => (
            <JobApplication
              key={job._id}
              job={job}
              columns={otherColumns}
            />
          ))}
        </SortableContext>

        <button
          type="button"
          className="w-full flex justify-center items-center gap-2 border-dashed border-2 py-2.5 rounded-md hover:bg-muted text-sm text-muted-foreground transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <CirclePlus size={18} />
          <span>Add Job</span>
        </button>
      </CardContent>
    </Card>
  );
};

// ############################################################################
// Main Kanban Board
// ############################################################################
interface KanbanBoardProps {
  boardDoc: Board;
}

const KanbanBoard = ({ boardDoc }: KanbanBoardProps) => {
  const { board, moveJob, resetToBaseline } = useBoard(boardDoc);
  const sortedColumns = board.columns;

  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const activeJobId = event.active?.id as string;
    const targetId = event.over?.id as string;

    if (!activeJobId || !targetId || activeJobId === targetId) return;

    // Stage visual arrangement
    moveJob(activeJobId, targetId);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const activeJobId = event.active?.id as string;
    const targetId = event.over?.id as string;

    if (!activeJobId || !targetId) {
      resetToBaseline();
      return;
    }

    const moveResult = moveJob(activeJobId, targetId);

    if (moveResult) {
      boardMutationQueue.enqueue(
        async () => {
          await moveJobToColumn({
            jobId: String(moveResult.jobId),
            targetColumnId: moveResult.newColumnId,
            targetOrder: moveResult.order,
          });
        },
        { key: String(moveResult.jobId) },
      );
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    resetToBaseline();
  }

  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === activeId);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <div className="flex gap-4 overflow-x-auto pb-16 h-full">
      <DndContext
        id="kanban-board-dnd-context"
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
      >
        {sortedColumns.map((col, key) => {
          const config = COLUMN_CONFIG[key % COLUMN_CONFIG.length];
          return (
            <DroppableColumn
              key={col._id}
              column={col}
              config={config}
              columns={sortedColumns}
              boardId={board._id}
            />
          );
        })}

        <DragOverlay>
          {activeJob ? <JobApplicationCard job={activeJob} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
