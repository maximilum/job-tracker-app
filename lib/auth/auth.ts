import { DBAdapter } from "./../../node_modules/@better-auth/core/src/db/adapter/index";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import connectDB from "../db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
});

export async function getSession() {
  const headersList = await headers();
  return await auth.api.getSession({
    headers: headersList,
  });
}

export async function signOut() {
  const headersList = await headers();
  const result = await auth.api.signOut({
    headers: headersList,
  });

  if (result?.success) {
    redirect("/sign-in");
  }
}
