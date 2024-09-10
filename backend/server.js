// server.js

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Placeholder route
app.get('/', (req, res) => {
    res.send('FinFlex Backend is running.');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

