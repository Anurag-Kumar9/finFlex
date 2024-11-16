const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const cashflowRoutes = require('./routes/cashflow');

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from 'frontend/public'
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use('/src', express.static(path.join(__dirname, '../frontend/src')));



// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Routes for expenses
app.use('/api/cashflow', cashflowRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
