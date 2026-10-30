const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const seedData = require('./seed');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusSync Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Root fallback
app.get('/', (req, res) => {
  res.send('CampusSync API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Server & Database
const startServer = async () => {
  try {
    await connectDB();
    // Auto-seed if database is empty
    await seedData(true);

    app.listen(PORT, () => {
      console.log(`🚀 CampusSync Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
