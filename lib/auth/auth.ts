import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import connectDB from "../db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import initUserBoard from "../init_user_board";

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
   trustedOrigins: ["https://job-tracker-app-eta-one.vercel.app"],
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user) {
            await initUserBoard(user.id);
          }
        },
      },
    },
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
