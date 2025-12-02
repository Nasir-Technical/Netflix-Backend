import serverless from 'serverless-http';
import app from '../app.js';   // ← direct app file (dist nahi)

export default serverless(app); // ← MUST be export default