import React from "react";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return <div>New Dashboard</div>;
};

export default Dashboard;
