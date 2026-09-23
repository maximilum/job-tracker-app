import { z } from "zod";

export const createJobApplicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  position: z.string().trim().min(1, "Position is required"),
  location: z.string().trim().optional(),
  status: z.string().trim().default("applied"),
  columnId: z.string().trim().min(1, "Column ID is required"),
  boardId: z.string().trim().min(1, "Board ID is required"),
  notes: z.string().trim().optional(),
  salary: z.string().trim().optional(),
  jobUrl: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  description: z.string().trim().optional(),
  appliedDate: z.coerce.date().optional(),
});

export const reorderColumnJobsSchema = z.object({
  columnId: z.string().trim().min(1, "Column ID is required"),
  orderedJobIds: z.array(z.string().trim().min(1)),
});

export const moveJobToColumnSchema = z.object({
  jobId: z.string().trim().min(1, "Job ID is required"),
  targetColumnId: z.string().trim().min(1, "Target Column ID is required"),
  targetOrder: z.number().int().nonnegative().optional(),
});

export const updateJobFieldsSchema = z.object({
  jobId: z.string().trim().min(1, "Job ID is required"),
  company: z.string().trim().min(1).optional(),
  position: z.string().trim().min(1).optional(),
  location: z.string().trim().optional(),
  status: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  salary: z.string().trim().optional(),
  jobUrl: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  description: z.string().trim().optional(),
  appliedDate: z.coerce.date().optional(),
});

export const deleteJobApplicationSchema = z.object({
  jobId: z.string().trim().min(1, "Job ID is required"),
});

export type CreateJobInput = z.infer<typeof createJobApplicationSchema>;
export type ReorderColumnJobsInput = z.infer<typeof reorderColumnJobsSchema>;
export type MoveJobToColumnInput = z.infer<typeof moveJobToColumnSchema>;
export type UpdateJobFieldsInput = z.infer<typeof updateJobFieldsSchema>;
export type DeleteJobInput = z.infer<typeof deleteJobApplicationSchema>;
