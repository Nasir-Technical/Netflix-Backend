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

// ✅ CORS Options
const corsOptions = {
  origin: [
    "http://localhost:3000", // Local development
    "https://netflix-frontend-one-chi.vercel.app", // Vercel frontend
    "https://shirts-valves-neighborhood-legitimate.trycloudflare.com" // Cloudflare tunnel
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

// ✅ CORS Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // For preflight requests

// ✅ Manually set headers (extra safety)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Routes
app.use("/api/v1/user", userRoute);

// Health check
app.get("/api/test", (req, res) => {
  res.send("✅ Backend is working!");
});

// Server listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
