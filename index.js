const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import the routes
const authRoutes = require('./auth');

// Create an instance of Express
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to DB
require('./db')

// Routes
app.use('/authenticate', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});