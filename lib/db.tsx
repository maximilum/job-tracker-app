import mongoose from "mongoose";

interface mongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: mongooseCache | undefined;
}

const cached: mongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

const MONGO_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log("database connected");
  } catch (error) {
    console.log("error connecting to database", error);
    cached.promise = null;
  }
  return cached.conn;
}

export default connectDB;
