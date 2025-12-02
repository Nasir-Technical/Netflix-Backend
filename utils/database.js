import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

let isConnected = false; // <-- important for serverless

export default async function databaseConnection() {
  if (isConnected) {
    console.log("MongoDB already connected.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully (serverless)");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
