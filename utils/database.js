import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // <-- yeh line add karo

const MONGO_URL = process.env.MONGO_URL;

let isConnected = false;

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