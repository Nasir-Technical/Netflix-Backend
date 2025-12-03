import express from 'express';
import dotenv from 'dotenv';
import databaseConnection from './utils/database.js';
import cookieParser from 'cookie-parser';
import userRoute from "./routes/userRoute.js";
import cors from "cors";

dotenv.config();

const app = express();

// ❗ Connect DB only once
databaseConnection();

// CORS setup
const corsOptions = {
  origin: [
    "https://netflix-frontend-five-phi.vercel.app",
    "http://localhost:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRoute);

app.get("/api/test", (req, res) => {
  res.send("Backend is working!");
});

export default app;
