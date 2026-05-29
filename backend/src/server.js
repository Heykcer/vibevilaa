import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Determine Port
const PORT = process.env.PORT || 5000;

// Start Server Listening
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Promise Rejection: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
