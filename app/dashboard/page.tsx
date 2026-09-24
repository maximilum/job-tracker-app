import React, { Suspense } from "react";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Board, Column, JobApplication } from "@/lib/models";
import connectDB from "@/lib/db";
import KanbanBoard from "@/components/KanbanBoard";
import DashboardHeader from "@/components/DashboardHeader";
import initUserBoard from "@/lib/init_user_board";
import { Board as BoardI, Column as ColumnI, JobApplication as JobI } from "@/lib/models/models.types";

const DashboardComponent = async () => {
  const session = await getSession();
  if (!session?.user?.id) redirect("/sign-in");

  async function getBoard(userId: string): Promise<BoardI | null> {
    await connectDB();

    let boardDoc = await Board.findOne({ userId });
    if (!boardDoc) {
      boardDoc = await initUserBoard(userId);
    }
    if (!boardDoc) return null;

    // Fetch all columns for this board sorted deterministically
    const columns = await Column.find({ boardId: boardDoc._id }).sort({
      order: 1,
      _id: 1,
    });

    // Fetch jobs for each column directly from JobApplication collection (single source of truth)
    const columnsWithJobs: ColumnI[] = await Promise.all(
      columns.map(async (col) => {
        const jobs = await JobApplication.find({ columnId: col._id }).sort({
          order: 1,
          _id: 1,
        });

        return {
          _id: col._id.toString(),
          name: col.name,
          boardId: col.boardId.toString(),
          order: col.order,
          userId: col.userId,
          jobApplications: JSON.parse(JSON.stringify(jobs)) as JobI[],
        };
      }),
    );

    return {
      _id: boardDoc._id.toString(),
      name: boardDoc.name,
      columns: columnsWithJobs,
    };
  }

  const board = await getBoard(session.user.id);

  if (!board) {
    return (
      <div className="flex h-[calc(100vh-52px)] items-center justify-center">
        <p className="text-muted-foreground">Unable to load board. Please refresh.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full h-[calc(100vh-52px)] py-4 px-4 lg:py-12 lg:px-36">
        <div className="w-full h-full">
          <DashboardHeader rawBoardName={board.name} />

          <KanbanBoard boardDoc={board} />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Suspense fallback={<h1 className="p-8">Loading...</h1>}>
      <DashboardComponent />
    </Suspense>
  );
};

export default Dashboard;
