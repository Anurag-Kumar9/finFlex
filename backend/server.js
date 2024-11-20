const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const cashflowRoutes = require('./routes/cashflow');
const taxRoutes = require('./routes/tax');
const budgetRoutes = require('./routes/budget');
const loanRoutes = require('./routes/loan');


// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from 'frontend/public'
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve static files from 'frontend/assets'
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

//app.use('/src', express.static(path.join(__dirname, '../frontend/src')));



// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Routes
app.use('/api/cashflow', cashflowRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/loan', loanRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
