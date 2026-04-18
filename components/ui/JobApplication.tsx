"use client";

import { useState } from "react";
import { JobApplication as Job, Column } from "../../lib/models/models.types";
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
  Trash,
} from "lucide-react";
import { Button } from "./button";

interface JobApplicationProps {
  job: Job;
  columns: Column[];
}

const JobApplication = ({ job, columns }: JobApplicationProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
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
            <h3 className="font-semibold" onClick={(e) => e.stopPropagation()}>
              {job.company}
            </h3>
          </CardTitle>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                {columns.map((col) => {
                  return (
                    <DropdownMenuItem key={col._id}>
                      <Button variant="ghost">
                        <span>Move to {col.name}</span>
                      </Button>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuItem className="">
                  <Button variant="ghost">
                    <span>
                      <Trash className="text-destructive" />
                    </span>
                    <p className="text-destructive">Delete</p>
                  </Button>
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
  );
};

export default JobApplication;
