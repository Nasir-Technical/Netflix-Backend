import express from 'express';
import dotenv from 'dotenv';
import databaseConnection from './utils/database.js';
import cookieParser from 'cookie-parser';
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Connect to the database
databaseConnection();

// Initialize Express app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS Options
const corsOptions = {
    origin: process.env.FRONT_URL,  
    methods: ['GET', 'POST'],
    credentials: true
};
app.use(cors(corsOptions));

// Resolve __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, './build')));

// Test Route
app.get("/test", (req, res) => {
    res.send("Serving...");
});

// Dummy Route
app.get('/dummy', (req, res) => {
    res.send('<h1>This is a dummy route</h1>');
});

// API Routes
app.use("/api/v1/user", userRoute);

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
    if (req.cookies.token) {
        next(); 
    } else {
        res.redirect('/'); 
    }
};

// Protect /browse route
app.get('/browse', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

// Serve React app for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

// ===== LOCALHOST pe server chalane ke liye listen karo =====
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// ===== Vercel ke liye app export kar do =====
export default app;
