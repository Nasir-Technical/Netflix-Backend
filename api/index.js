// api/index.js
import dotenv from 'dotenv';
dotenv.config();
import app from '../index.js';
import serverless from 'serverless-http';

export default serverless(app);   // ← MUST be default export