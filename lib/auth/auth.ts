import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import connectDB from "../db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import initUserBoard from "../init_user_board";
import type { Db, MongoClient } from "mongodb";

function createAuth(db: Db, client: MongoClient) {
  const trustedOrigins = [
    "https://job-tracker-app-eta-one.vercel.app",
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean) as string[];

  return betterAuth({
    trustedOrigins,
    database: mongodbAdapter(db, {
      client,
      transaction: false,
    }),
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github"],
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        enabled: Boolean(
          process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
        ),
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        enabled: Boolean(
          process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
        ),
      },
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
            if (user?.id) {
              try {
                await initUserBoard(user.id);
              } catch (error) {
                console.error("Failed to initialize board for user:", user.id, error);
              }
            }
          },
        },
      },
    },
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

let authInstance: AuthInstance | null = null;
let authPromise: Promise<AuthInstance> | null = null;

// Lazy, cached initialization inside getter function (Fixes Bug 6.2 & Addendum #5)
export async function getAuth(): Promise<AuthInstance> {
  if (authInstance) return authInstance;

  if (!authPromise) {
    authPromise = (async () => {
      try {
        const mongooseInstance = await connectDB();
        const client = mongooseInstance.connection.getClient() as unknown as MongoClient;
        const db = client.db();
        authInstance = createAuth(db, client);
        return authInstance;
      } catch (error) {
        authPromise = null;
        throw error;
      }
    })();
  }

  return await authPromise;
}

// Transparent proxy to delegate to lazy instance without top-level await
export const auth = new Proxy({} as AuthInstance, {
  get(target, prop, receiver) {
    if (prop === "handler") {
      return async (req: Request) => {
        const instance = await getAuth();
        return instance.handler(req);
      };
    }
    if (authInstance) {
      return Reflect.get(authInstance, prop, receiver);
    }
    return Reflect.get(target, prop, receiver);
  },
  has(target, prop) {
    if (prop === "handler") {
      return true;
    }
    if (authInstance) {
      return Reflect.has(authInstance, prop);
    }
    return Reflect.has(target, prop);
  },
});

export async function getSession() {
  const headersList = await headers();
  const instance = await getAuth();
  return await instance.api.getSession({
    headers: headersList,
  });
}

export async function signOut() {
  const headersList = await headers();
  const instance = await getAuth();
  const result = await instance.api.signOut({
    headers: headersList,
  });

  if (result?.success) {
    redirect("/sign-in");
  }
}
