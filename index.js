import express from 'express';
import dotenv from 'dotenv';
import databaseConnection from './utils/database.js';
import cookieParser from 'cookie-parser';
import userRoute from "./routes/userRoute.js";
import cors from "cors";

// Load env vars
dotenv.config();

// Connect to DB
databaseConnection();

// App initialize
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const corsOptions = {
    origin: 'https://netflix-backend-three.vercel.app/', // or 3000 depending on frontend
    methods: ["GET", "POST"],
    credentials: true,
};
app.use(cors(corsOptions));



// Routes
app.use("/api/v1/user", userRoute);

// Health check
app.get("/api/test", (req, res) => {
    res.send("Backend is working!");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
