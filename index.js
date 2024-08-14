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

const corsOptions = {
    origin: process.env.FRONT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
};
app.use(cors(corsOptions));

// Resolve __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, './build')));

app.get("/test", (req, res) => {
    res.send("Serving...");
});

// API Routes
app.use("/api/v1/user", userRoute);

// Handle any requests that don't match the ones above and serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
    if (req.cookies.token) {
        next(); // User is authenticated
    } else {
        res.redirect('/'); // User is not authenticated, redirect to login page
    }
};

// Protect the /browse route
app.get('/browse', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
