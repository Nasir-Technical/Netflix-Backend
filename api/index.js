// api/index.js
const serverless = require('serverless-http');
const app = require('../dist/app.js'); // ← aap ki compiled Express app

module.exports = serverless(app);      // ← MUST be module.exports