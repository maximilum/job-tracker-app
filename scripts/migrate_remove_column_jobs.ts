import connectDB from "../lib/db";
import "@/lib/models";
import { Column } from "@/lib/models";

export async function dropColumnJobApplications() {
  await connectDB();
  console.log("=== Migration: Drop Column.jobApplications field ===");

  // Drop jobApplications field from all column documents
  const result = await Column.updateMany(
    { jobApplications: { $exists: true } },
    { $unset: { jobApplications: "" } },
  );

  console.log(`Updated ${result.modifiedCount} column document(s).`);
  console.log("Migration completed successfully.");
}

if (process.argv[1]?.includes("migrate_remove_column_jobs")) {
  dropColumnJobApplications()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
