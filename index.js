import express from 'express';
import dotenv from 'dotenv';
import databaseConnection from '../utils/database.js';
import cookieParser from 'cookie-parser';
import userRoute from "../routes/userRoute.js";
import cors from "cors";


// Load env vars
dotenv.config();

// Connect to DB
databaseConnection();

// App initialize
const app = express();

// CORS
// CORS FIX (Vercel Serverless Compatible)
const corsOptions = {
  origin: [
    "https://netflix-frontend-five-phi.vercel.app",
    "http://localhost:3000",
    "https://netflix-backend-tawny.vercel.app/"
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "Content-Type, Authorization"
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // <-- VERY IMPORTANT

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);

// Health check
app.get("/api/test", (req, res) => {
    res.send("Backend is working!");
});

// Start server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`✅ Server is running on port ${PORT}`);
// });

export default app;