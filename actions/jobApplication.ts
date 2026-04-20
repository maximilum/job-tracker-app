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
