import { DBAdapter } from "./../../node_modules/@better-auth/core/src/db/adapter/index";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import connectDB from "../db";

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
