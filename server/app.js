// server.js or app.js
const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken, authorizeRole } = require('./middleware/authMiddleware');

const app = express();
const PORT = 3000;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:8083',  // React client
  'http://localhost:3000',  // For testing if needed
  'https://your-allowed-domain.com' // Example additional domain
];

// Set up CORS options to allow requests from these origins
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Public route for login
app.use('/api/auth', authRoutes);

// Protected customer routes require a valid JWT token and authorized role
app.use('/api/customers', authenticateToken, authorizeRole(['admin', 'user']), customerRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app; // Export app for testing purposes
