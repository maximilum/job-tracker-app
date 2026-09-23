import connectDB from "../lib/db";
import "@/lib/models";
import { Column, JobApplication } from "@/lib/models";
import mongoose from "mongoose";

interface JobDoc {
  _id: mongoose.Types.ObjectId;
  order: number;
}

export async function repairOrders() {
  await connectDB();
  console.log("=== Starting Column & Job Order Repair ===");

  const columns = await Column.find({});
  let totalDanglingRemoved = 0;
  let totalJobsRedensified = 0;

  for (const column of columns) {
    console.log(`\nProcessing column: "${column.name}" (${column._id})`);

    // 1. Fetch all existing jobs belonging to this column
    const existingJobs = await JobApplication.find({ columnId: column._id })
      .select("_id order")
      .lean<JobDoc[]>();

    const existingJobIdSet = new Set(
      existingJobs.map((j) => j._id.toString()),
    );

    // 2. Remove dangling IDs from column.jobApplications if any
    const originalColumnIds: mongoose.Types.ObjectId[] =
      column.jobApplications || [];
    const validColumnIds = originalColumnIds.filter((id) =>
      existingJobIdSet.has(id.toString()),
    );

    const danglingCount = originalColumnIds.length - validColumnIds.length;
    if (danglingCount > 0) {
      console.log(
        `  -> Found and removed ${danglingCount} dangling job application reference(s).`,
      );
      totalDanglingRemoved += danglingCount;
    }

    // 3. Sort existing jobs deterministically by (order, _id)
    const sortedJobs = [...existingJobs].sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a._id.toString().localeCompare(b._id.toString());
    });

    // 4. Check for order gaps or duplicates
    const bulkOps: Array<{
      updateOne: {
        filter: { _id: mongoose.Types.ObjectId };
        update: { $set: { order: number } };
      };
    }> = [];

    const orderedJobIds: mongoose.Types.ObjectId[] = [];

    sortedJobs.forEach((job, index) => {
      orderedJobIds.push(job._id);
      if (job.order !== index) {
        bulkOps.push({
          updateOne: {
            filter: { _id: job._id },
            update: { $set: { order: index } },
          },
        });
      }
    });

    if (bulkOps.length > 0) {
      console.log(
        `  -> Re-densifying ${bulkOps.length} job(s) with sparse or duplicate orders to 0..${sortedJobs.length - 1}.`,
      );
      await JobApplication.bulkWrite(bulkOps);
      totalJobsRedensified += bulkOps.length;
    } else {
      console.log(
        `  -> All ${sortedJobs.length} job orders are already dense and unique (0..${sortedJobs.length - 1}).`,
      );
    }

    // 5. Update column.jobApplications array to match canonical ordered IDs
    column.jobApplications = orderedJobIds;
    await column.save();
  }

  console.log("\n=== Repair Complete ===");
  console.log(`Total dangling references removed: ${totalDanglingRemoved}`);
  console.log(`Total job documents re-densified: ${totalJobsRedensified}`);
}

// Execute when run directly via tsx
if (process.argv[1]?.includes("repair_orders")) {
  repairOrders()
    .then(() => {
      console.log("Repair finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Repair failed:", err);
      process.exit(1);
    });
}
