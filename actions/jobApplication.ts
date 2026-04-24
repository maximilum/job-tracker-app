"use server";

import connectDB from "@/lib/db";
import { JobApplication as JobI } from "@/lib/models/models.types";
import { getSession } from "@/lib/auth/auth";
import { Board } from "@/lib/models";
import { Column } from "@/lib/models";
import { JobApplication } from "@/lib/models";
import { revalidatePath } from "next/cache";

// ######################################################################################
//  Create job
// ######################################################################################
export async function createJobApplication(
  job: Omit<JobI, "_id" | "order" | "userId"> & { userId?: string },
) {
  console.log("starting the creating process");

  // check for rquired data
  if (
    !job.company ||
    !job.position ||
    !job.columnId ||
    !job.boardId ||
    !job.status
  ) {
    console.log("Missing required data");
    return { error: "Missing required data" };
  }
  // check authorization
  const session = await getSession();
  if (!session?.user) {
    console.log("unauthorized");
    return { error: "Unauthorized" };
  }
  //   reassign the user id
  job.userId = session.user.id;

  await connectDB();

  //   Check if column exists
  const column = await Column.findOne({ _id: job.columnId });
  if (!column) {
    return { error: "Column not found" };
  }

  // Chech if board belongs to user
  console.log(job.boardId);
  const board = await Board.findOne({ _id: job.boardId });
  if (!board) {
    console.log("Board not found");
    return { error: "Board not found" };
  }
  if (board.userId.toString() !== session.user.id) {
    console.log("Board Doesn't belong to user");
    return { error: "Board Doesn't belong to user" };
  }

  //create job application
  const jobApplication = new JobApplication(job);

  // Calculate the order
  const count = await JobApplication.countDocuments({ columnId: job.columnId });
  const order = count;

  //assign new order
  jobApplication.order = order;
  const res = await jobApplication.save();

  // add job to column
  column.jobApplications.push(jobApplication._id);
  await column.save();

  revalidatePath("/dashboard");
  return {
    success: "Job application created successfully",
    data: JSON.parse(JSON.stringify(jobApplication)),
  };
}

// ######################################################################################
//  Delete job
// ######################################################################################
export async function deleteJobApplication(jobId: string) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "Unauthorized!" };
  }

  await connectDB();

  try {
    const jobApplication = await JobApplication.findOne({
      _id: jobId,
      userId: userId,
    });

    if (!jobApplication) {
      return { error: "Unauthorized!" };
    }

    await Column.findByIdAndUpdate(jobApplication.columnId, {
      $pull: { jobApplications: jobApplication._id },
    });

    await jobApplication.deleteOne();

    revalidatePath("/dashboard");
    return { success: "Job application deleted successfully" };
  } catch (error) {
    return { error: error };
  }
}

// ######################################################################################
//  Update job
// ######################################################################################
type Updates = Partial<{
  jobId: string;
  company: string;
  position: string;
  location?: string;
  status: string;
  columnId: string;
  boardId: string;
  userId: string;
  order: number;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
}>;

export async function updateJobApplication(updates: Updates) {
  // destructuring updates
  const { jobId, columnId: newColumnId, order, ...restOfUpdates } = updates;

  if (!newColumnId || !jobId) return { error: "Invalid update data" };

  // Authorization
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return { error: "Unauthorized!" };
  }

  await connectDB();

  const originalJobApplication = await JobApplication.findOne({
    _id: jobId,
    userId: user.id,
  });

  if (!originalJobApplication) return { error: "Unauthorized!" };

  if (newColumnId) {
    const column = await Column.findOne({ _id: newColumnId, userId: user.id });
    if (!column) {
      return { error: "Unauthorized!" };
    }
  }

  //#####Logic######
  // if (order !== undefined)
  //     if (newcolumnId !== columnId)
  //         4- dragging to a different column
  //     else (newColumnid === columnId)
  //         3- dragging in the same column
  // else (order === undefined)
  //     if (newColumnId !== columnId)
  //         2- moving
  //     else (newColumnId === columnId)
  //         1- editing

  //   Preparing Variables for updates
  let newOrder: number;
  let updatesToApply: Updates = {};

  if (order !== undefined && order !== null) {
    // Check the original column Id
    const originalColumnId = originalJobApplication.columnId.toString();
    if (newColumnId !== originalColumnId) {
      // 1- dragging to a different column
      const jobsInNewColumnId = await JobApplication.find({
        columnId: newColumnId,
      })
        .sort({ order: 1 })
        .select("_id");
      const jobsInNewColumnToShiftDown = jobsInNewColumnId
        .slice(order)
        .map((job) => job._id.toString());
      await JobApplication.updateMany(
        {
          _id: { $in: jobsInNewColumnToShiftDown },
        },
        { $inc: { order: 1 } },
      );
      updatesToApply = { order, columnId: newColumnId };
      // pull id from original column
      if (jobId) {
        await Column.findOneAndUpdate(
          { _id: originalColumnId },
          { $pull: { jobApplications: jobId } },
        );
        // push id to new column
        await Column.findOneAndUpdate(
          { _id: newColumnId },
          { $push: { jobApplications: jobId } },
        );
      }
    } else if (newColumnId === originalColumnId) {
      // 2- dragging in the same column
      // Fetch the actual jobs from the database sorted by their order
      const jobsInColumnId = await JobApplication.find({
        columnId: originalColumnId,
      })
        .sort({ order: 1 })
        .select("_id");

      const originalIndex = jobsInColumnId.findIndex(
        (job) => job._id.toString() === jobId,
      );

      // 2.1 dragging up
      if (originalIndex > order) {
        const jobsToIncOrder = jobsInColumnId
          .slice(order, originalIndex)
          .map((job) => job._id.toString());
        await JobApplication.updateMany(
          { _id: { $in: jobsToIncOrder } },
          { $inc: { order: 1 } },
        );
      }
      // 2.2 dragging down
      else if (originalIndex < order) {
        const jobsToDecOrder = jobsInColumnId
          .slice(originalIndex + 1, order + 1)
          .map((job) => job._id.toString());
        await JobApplication.updateMany(
          { _id: { $in: jobsToDecOrder } },
          { $inc: { order: -1 } },
        );
      }

      // Add the final update for the dragged job itself
      updatesToApply = { order };
    }
  } else if (order === undefined || order === null) {
    // Check the original column Id
    const originalColumnId = originalJobApplication.columnId.toString();
    if (newColumnId !== originalColumnId.toString()) {
      // 3- moving
      // $$$$$ moving from menu logic $$$$$
      //     * remove from the original column
      //         - remove the job application from the column.jobApplcations[]
      await Column.updateOne(
        { _id: originalColumnId },
        { $pull: { jobApplications: jobId } },
      );
      //         - update the remaining jobApplications orders
      //             # get the original "truth Source" job order
      //                 get all jobs "sorted" "using columnId"
      const originalJobs = await JobApplication.find({
        columnId: originalColumnId,
      })
        .sort({ order: 1 })
        .select("_id order");
      //                 calculate order from all jobs "Findindex"
      const originalIndex = originalJobs.findIndex(
        (job) => job._id.toString() === jobId,
      );
      //             # get the remaining jop applications docs
      //                 filter the moved job from all jobs "sorted"
      const remainingJobs = originalJobs.filter(
        (job) => job._id.toString() !== jobId.toString(),
      );
      //             # slice using the order
      const jobsToMove = remainingJobs.slice(originalIndex);
      const jobsToMoveIds = jobsToMove.map((job) => job._id);
      //             # mutate the orders (order - 1) for the sliced jobs
      await JobApplication.updateMany(
        { _id: { $in: jobsToMoveIds } },
        { $inc: { order: -1 } },
      );
      //   * Add job to new column.jobApplications
      //     - find and update newcolumn $push
      await Column.updateOne(
        { _id: newColumnId },
        { $push: { jobApplications: jobId } },
      );
      //     * calculate the new order "last"
      //         - get the jobs length
      //         - new order = length
      newOrder = await JobApplication.countDocuments({ columnId: newColumnId });
      updatesToApply = { order: newOrder, columnId: newColumnId };
    } else if (newColumnId === originalColumnId) {
      // 4- editing
      const { userId, boardId, ...safeUpdates } = restOfUpdates;
      updatesToApply = safeUpdates;
    }
  }

  //  ########### FINAL UPDATE ################################
  await JobApplication.updateOne({ _id: jobId }, updatesToApply);
  revalidatePath("/dashboard");
  return { success: true };
}
