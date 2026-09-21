const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('../backend/config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/items', require('../backend/routes/itemRoutes'));

// Root Endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Campus Lost & Found API Server Running on Vercel',
    status: 'Active',
    time: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
