require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'frontend/public' directory
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve CSS and JS files from the 'frontend/src' directory
app.use('/src', express.static(path.join(__dirname, '../frontend/src')));

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Sample endpoint that uses an environment variable
app.get('/env', (req, res) => {
  res.send(`Environment variable value: ${process.env.YOUR_ENV_VARIABLE}`);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
