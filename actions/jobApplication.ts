"use server";

import connectDB from "@/lib/db";
import { JobApplication as JobI } from "../../lib/models/models.types";
import { getSession } from "@/lib/auth/auth";
import { Board } from "@/lib/models";
import { Column } from "@/lib/models";
import { JobApplication } from "@/lib/models";
import { revalidatePath } from "next/cache";

export async function createJobApplication(job: JobI) {
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
  await connectDB();
  console.log("test");

  //   Check if column exists
  const column = await Column.findOne({ _id: job.columnId });
  if (!column) {
    return { error: "Column not found" };
  }

  // check authorization
  const session = await getSession();
  if (!session?.user) {
    console.log("unauthorized");
    return { error: "Unauthorized" };
  }

  //   reasign th euser id
  job.userId = session.user.id;

  // Chech if board belongs to user
  console.log(job.boardId);
  const board = await Board.findOne({ _id: job.boardId });
  if (!board) {
    console.log("Board not found");
    return { error: "Board not found" };
  }
  if (board.userId !== session.user.id) {
    console.log("Board Doesn't belong to user");
    return { error: "Board Doesn't belong to user" };
  }

  //create job application
  const jobApplication = new JobApplication(job);

  // Calculate the order
  const count = await JobApplication.countDocuments({ columnId: job.columnId });
  const index = count;
  const order = index * 100;

  //assign new order
  jobApplication.order = order;
  const res = await jobApplication.save();
  console.log(res);

  // add job to column
  column.jobApplications.push(jobApplication._id);
  await column.save();

  //   Update orders

  revalidatePath("/dashboard");
  return {
    success: "Job application created successfully",
    data: JSON.parse(JSON.stringify(jobApplication)),
  };
}

export async function deleteJobApplication(jobId: string) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "Unauthorized!" };
  }

  await connectDB();

  try {
    const jobApplication = await JobApplication.findOne({ _id: jobId });
    console.log(jobApplication);

    if (!jobApplication) {
      return { error: "Job application not found" };
    }

    if (jobApplication.userId.toString() !== userId.toString()) {
      console.log("Unauthorized!");
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
  console.log("jobId: ", jobId);
  console.log("newColumnId: ", newColumnId);
  console.log("order: ", order);
  console.log("restOfUpdates: ", restOfUpdates);

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
  let UpdatesToApply: Updates = {};

  if (order !== undefined && order !== null) {
    // Check the original column Id
    const originalColumnId = originalJobApplication.columnId;
    console.log("original column id: ", originalColumnId);
    if (newColumnId !== originalColumnId) {
      // 1- dragging to a different column
    } else if (newColumnId === originalColumnId) {
      // 2- dragging in the same column
    }
  } else if (order === undefined || order === null) {
    // Check the original column Id
    const originalColumnId = originalJobApplication.columnId.toString();
    if (newColumnId !== originalColumnId.toString()) {
      console.log("moving menu");
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
      const originalIndex = originalJobs.findIndex((job) => job._id === jobId);
      //             # get the remaining jop applications docs
      //                 filter the moved job from all jobs "sorted"
      const remainingJobs = originalJobs.filter((job) => job._id !== jobId);
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
      //         - get the new column
      const newJobs: { _id: string }[] = await JobApplication.find({
        columnId: newColumnId,
      }).select("_id");
      //         - get the jobs length
      //         - new order = length
      newOrder = newJobs.length;
      UpdatesToApply = { order: newOrder, columnId: newColumnId };
    } else if (newColumnId === originalColumnId) {
      console.log("Editing");
      // 4- editing
      UpdatesToApply = { ...restOfUpdates };
    }
  }

  //  ########### FINAL UPDATE ################################

  await JobApplication.updateOne({ _id: jobId }, UpdatesToApply);
  revalidatePath("/dashboard");
  return { success: true };
}
