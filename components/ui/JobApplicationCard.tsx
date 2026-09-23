import React from "react";
import { JobApplication as JobI } from "@/lib/models/models.types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Badge } from "./badge";
import { CircleDollarSign, LocateFixed, GripVertical } from "lucide-react";

interface JobApplicationCardProps {
  job: JobI;
  isOverlay?: boolean;
}

export const JobApplicationCard: React.FC<JobApplicationCardProps> = ({
  job,
  isOverlay = false,
}) => {
  return (
    <Card
      className={`py-2 pb-4 px-4 gap-2 border shadow-sm ${
        isOverlay ? "shadow-2xl ring-2 ring-primary/40 rotate-1 scale-105" : ""
      }`}
    >
      <CardHeader className="p-0">
        <div className="text-md w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              <GripVertical size={16} />
            </span>
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
            <div className="h-8 w-8" />
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
      {job.tags && job.tags.length > 0 && (
        <CardContent className="px-0 pt-2 pb-0">
          <div className="flex gap-1.5 p-0 flex-wrap">
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
        </CardContent>
      )}
    </Card>
  );
};

export default JobApplicationCard;
