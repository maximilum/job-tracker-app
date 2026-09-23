"use server";

import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth/auth";
import { Board, Column, JobApplication } from "@/lib/models";
import mongoose from "mongoose";
import {
  createJobApplicationSchema,
  reorderColumnJobsSchema,
  moveJobToColumnSchema,
  updateJobFieldsSchema,
  deleteJobApplicationSchema,
  CreateJobInput,
  ReorderColumnJobsInput,
  MoveJobToColumnInput,
  UpdateJobFieldsInput,
  DeleteJobInput,
} from "@/lib/validations/jobApplication";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

// Auth helper
async function getAuthenticatedUser() {
  const session = await getSession();
  if (!session?.user?.id) {
    return null;
  }
  return session.user;
}

// Transaction execution helper supporting replica sets and standalone fallback
async function runWithTransaction<T>(
  work: (session: mongoose.ClientSession | null) => Promise<T>,
): Promise<T> {
  const conn = await connectDB();
  let session: mongoose.ClientSession | null = null;
  try {
    session = await conn.startSession();
    let result: T;
    try {
      await session.withTransaction(async () => {
        result = await work(session);
      });
      return result!;
    } catch (txErr: unknown) {
      const errMessage = txErr instanceof Error ? txErr.message : String(txErr);
      if (
        errMessage.includes("replica set") ||
        errMessage.includes("Transaction numbers are only allowed")
      ) {
        return await work(null);
      }
      throw txErr;
    }
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    if (
      errMessage.includes("replica set") ||
      errMessage.includes("Transaction numbers are only allowed")
    ) {
      return await work(null);
    }
    throw err;
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}

// ============================================================================
// 1. Create Job Application
// ============================================================================
export async function createJobApplication(
  input: CreateJobInput,
): Promise<ActionResult> {
  const parseResult = createJobApplicationSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parseResult.error.issues[0]?.message || "Invalid input data",
      },
    };
  }
  const data = parseResult.data;

  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "User is not authenticated" },
    };
  }

  await connectDB();

  // Authz check: Board ownership
  const board = await Board.findOne({ _id: data.boardId, userId: user.id });
  if (!board) {
    return {
      success: false,
      error: { code: "BOARD_NOT_FOUND", message: "Board not found or unauthorized" },
    };
  }

  // Authz check: Column ownership & board match (IDOR fix)
  const column = await Column.findOne({
    _id: data.columnId,
    boardId: data.boardId,
    userId: user.id,
  });
  if (!column) {
    return {
      success: false,
      error: { code: "COLUMN_NOT_FOUND", message: "Column not found or unauthorized" },
    };
  }

  return await runWithTransaction(async (session) => {
    // Atomic order assignment
    const countQuery = JobApplication.countDocuments({
      columnId: data.columnId,
    });
    if (session) countQuery.session(session);
    const count = await countQuery;

    const job = new JobApplication({
      ...data,
      userId: user.id,
      order: count,
    });

    if (session) {
      await job.save({ session });
    } else {
      await job.save();
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(job)),
    };
  });
}

// ============================================================================
// 2. Reorder Column Jobs
// ============================================================================
export async function reorderColumnJobs(
  input: ReorderColumnJobsInput,
): Promise<ActionResult> {
  const parseResult = reorderColumnJobsSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parseResult.error.issues[0]?.message || "Invalid input data",
      },
    };
  }
  const { columnId, orderedJobIds } = parseResult.data;

  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "User is not authenticated" },
    };
  }

  await connectDB();

  // Authz check: Column ownership
  const column = await Column.findOne({ _id: columnId, userId: user.id });
  if (!column) {
    return {
      success: false,
      error: { code: "COLUMN_NOT_FOUND", message: "Column not found or unauthorized" },
    };
  }

  return await runWithTransaction(async (session) => {
    const bulkOps = orderedJobIds.map((jobId, index) => ({
      updateOne: {
        filter: { _id: jobId, columnId, userId: user.id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      if (session) {
        await JobApplication.bulkWrite(bulkOps, { session });
      } else {
        await JobApplication.bulkWrite(bulkOps);
      }
    }

    return {
      success: true,
      data: { columnId, updatedCount: bulkOps.length },
    };
  });
}

// ============================================================================
// 3. Move Job To Column (cross-column or to specific order)
// ============================================================================
export async function moveJobToColumn(
  input: MoveJobToColumnInput,
): Promise<ActionResult> {
  const parseResult = moveJobToColumnSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parseResult.error.issues[0]?.message || "Invalid input data",
      },
    };
  }
  const { jobId, targetColumnId, targetOrder } = parseResult.data;

  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "User is not authenticated" },
    };
  }

  await connectDB();

  const job = await JobApplication.findOne({ _id: jobId, userId: user.id });
  if (!job) {
    return {
      success: false,
      error: { code: "JOB_NOT_FOUND", message: "Job application not found or unauthorized" },
    };
  }

  const targetColumn = await Column.findOne({
    _id: targetColumnId,
    userId: user.id,
  });
  if (!targetColumn) {
    return {
      success: false,
      error: { code: "COLUMN_NOT_FOUND", message: "Target column not found or unauthorized" },
    };
  }

  const sourceColumnId = job.columnId.toString();

  return await runWithTransaction(async (session) => {
    if (sourceColumnId === targetColumnId) {
      // Same-column move
      const columnJobsQuery = JobApplication.find({ columnId: sourceColumnId, userId: user.id }).sort({ order: 1, _id: 1 });
      if (session) columnJobsQuery.session(session);
      const columnJobs = await columnJobsQuery;

      const otherJobs = columnJobs.filter((j) => j._id.toString() !== jobId);
      const insertAt =
        targetOrder !== undefined && targetOrder >= 0 && targetOrder <= otherJobs.length
          ? targetOrder
          : otherJobs.length;

      otherJobs.splice(insertAt, 0, job);

      const bulkOps = otherJobs.map((j, index) => ({
        updateOne: {
          filter: { _id: j._id },
          update: { $set: { order: index } },
        },
      }));

      if (bulkOps.length > 0) {
        if (session) {
          await JobApplication.bulkWrite(bulkOps, { session });
        } else {
          await JobApplication.bulkWrite(bulkOps);
        }
      }

      return { success: true, data: { jobId, columnId: targetColumnId, order: insertAt } };
    }

    // Cross-column move:
    // 1. Compact source column
    const sourceJobsQuery = JobApplication.find({
      columnId: sourceColumnId,
      userId: user.id,
      _id: { $ne: job._id },
    }).sort({ order: 1, _id: 1 });
    if (session) sourceJobsQuery.session(session);
    const sourceRemainingJobs = await sourceJobsQuery;

    const sourceBulkOps = sourceRemainingJobs.map((j, index) => ({
      updateOne: {
        filter: { _id: j._id },
        update: { $set: { order: index } },
      },
    }));

    if (sourceBulkOps.length > 0) {
      if (session) {
        await JobApplication.bulkWrite(sourceBulkOps, { session });
      } else {
        await JobApplication.bulkWrite(sourceBulkOps);
      }
    }

    // 2. Insert into target column
    const targetJobsQuery = JobApplication.find({
      columnId: targetColumnId,
      userId: user.id,
    }).sort({ order: 1, _id: 1 });
    if (session) targetJobsQuery.session(session);
    const targetJobs = await targetJobsQuery;

    const insertAt =
      targetOrder !== undefined && targetOrder >= 0 && targetOrder <= targetJobs.length
        ? targetOrder
        : targetJobs.length;

    targetJobs.splice(insertAt, 0, job);

    const targetBulkOps = targetJobs.map((j, index) => ({
      updateOne: {
        filter: { _id: j._id },
        update: {
          $set: {
            order: index,
            columnId: targetColumnId,
          },
        },
      },
    }));

    if (targetBulkOps.length > 0) {
      if (session) {
        await JobApplication.bulkWrite(targetBulkOps, { session });
      } else {
        await JobApplication.bulkWrite(targetBulkOps);
      }
    }

    return {
      success: true,
      data: { jobId, columnId: targetColumnId, order: insertAt },
    };
  });
}

// ============================================================================
// 4. Update Job Fields (Safe edit without columnId or order tampering)
// ============================================================================
export async function updateJobFields(
  input: UpdateJobFieldsInput,
): Promise<ActionResult> {
  const parseResult = updateJobFieldsSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parseResult.error.issues[0]?.message || "Invalid input data",
      },
    };
  }
  const { jobId, ...fields } = parseResult.data;

  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "User is not authenticated" },
    };
  }

  await connectDB();

  const updatedJob = await JobApplication.findOneAndUpdate(
    { _id: jobId, userId: user.id },
    { $set: fields },
    { new: true },
  );

  if (!updatedJob) {
    return {
      success: false,
      error: { code: "JOB_NOT_FOUND", message: "Job application not found or unauthorized" },
    };
  }

  return {
    success: true,
    data: JSON.parse(JSON.stringify(updatedJob)),
  };
}

// ============================================================================
// 5. Delete Job Application & Compact Column
// ============================================================================
export async function deleteJobApplication(
  input: DeleteJobInput | string,
): Promise<ActionResult> {
  const jobId = typeof input === "string" ? input : input?.jobId;
  const parseResult = deleteJobApplicationSchema.safeParse({ jobId });
  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parseResult.error.issues[0]?.message || "Invalid input data",
      },
    };
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      success: false,
      error: { code: "UNAUTHORIZED", message: "User is not authenticated" },
    };
  }

  await connectDB();

  const job = await JobApplication.findOne({ _id: jobId, userId: user.id });
  if (!job) {
    return {
      success: false,
      error: { code: "JOB_NOT_FOUND", message: "Job application not found or unauthorized" },
    };
  }

  const columnId = job.columnId.toString();

  return await runWithTransaction(async (session) => {
    if (session) {
      await job.deleteOne({ session });
    } else {
      await job.deleteOne();
    }

    // Re-densify remaining jobs
    const remainingJobsQuery = JobApplication.find({
      columnId,
      userId: user.id,
    }).sort({ order: 1, _id: 1 });
    if (session) remainingJobsQuery.session(session);
    const remainingJobs = await remainingJobsQuery;

    const bulkOps = remainingJobs.map((j, index) => ({
      updateOne: {
        filter: { _id: j._id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      if (session) {
        await JobApplication.bulkWrite(bulkOps, { session });
      } else {
        await JobApplication.bulkWrite(bulkOps);
      }
    }

    return {
      success: true,
      data: { deletedJobId: jobId, columnId },
    };
  });
}

// ============================================================================
// Backward compatibility bridge for existing callers
// ============================================================================
export async function updateJobApplication(updates: {
  jobId: string;
  columnId?: string;
  order?: number;
  [key: string]: unknown;
}): Promise<ActionResult> {
  const { jobId, columnId, order, ...rest } = updates;
  if (!jobId) {
    return {
      success: false,
      error: { code: "VALIDATION_ERROR", message: "jobId is required" },
    };
  }

  // If order or columnId is supplied, it's a move
  if (columnId !== undefined || order !== undefined) {
    if (columnId) {
      return await moveJobToColumn({
        jobId,
        targetColumnId: columnId,
        targetOrder: order,
      });
    }
  }

  // Otherwise it's a fields update
  return await updateJobFields({
    jobId,
    ...rest,
  });
}
