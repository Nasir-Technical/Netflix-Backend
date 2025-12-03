import mongoose from "mongoose";

let isConnected = false;

async function databaseConnection() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection FAILED");
    console.error(error);
  }
}

export default databaseConnection;
