import React from "react";
import { Board, Column } from "../lib/models/models.types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Award,
  Calendar,
  CheckCircle2,
  CirclePlus,
  Columns,
  EllipsisVertical,
  Mic,
  Trash,
  XCircle,
} from "lucide-react";
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
}

const DroppableColumn = ({ column, config, columns }: DroppableColumnProps) => {
  columns = columns.filter((col) => col._id !== column._id);

  return (
    <Card className="p-0 min-w-106 max-h-max ">
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
                  <Button
                    variant="ghost"
                    className=" flex items-center gap-3 px-4 text-destructive"
                  >
                    <span>
                      <Trash className="text-destructive" />
                    </span>
                    Delete
                  </Button>
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
          <div className="flex justify-center items-center gap-4 border-dashed border-2 py-2 hover:bg-muted">
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
          ></DroppableColumn>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
