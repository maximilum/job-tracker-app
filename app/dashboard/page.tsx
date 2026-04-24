import React, { Suspense } from "react";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Board } from "@/lib/models";
import connectDB from "@/lib/db";
import KanbanBoard from "@/components/KanbanBoard";
import { Board as BoardType } from "@/lib/models/models.types";
import { Button } from "@/components/ui/button";
import { createJobApplication } from "@/actions/jobApplication";

const DashboardComponent = async () => {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  async function getBoard(userID: string) {
    "use cache";
    await connectDB();

    const boardDoc = await Board.findOne({ userId: userID }).populate({
      path: "columns",
      populate: { path: "jobApplications" },
    });
    const board = JSON.parse(JSON.stringify(boardDoc));
    if (!board) return { error: "Board not found" };
    return board;
  }

  const board = await getBoard(session?.user.id ?? "");

  return (
    <div>
      <div className=" w-full h-[calc(100vh-52px)]  py-4 px-4 lg:py-12 lg:px-36 ">
        <div className=" w-full h-full">
          <h1 className=" text-2xl mb-8">
            {board.name}
            <p className="text-sm text-accent-foreground">
              Track Your Applications
            </p>
          </h1>

          <KanbanBoard boardDoc={board}></KanbanBoard>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <DashboardComponent></DashboardComponent>
    </Suspense>
  );
};

export default Dashboard;
