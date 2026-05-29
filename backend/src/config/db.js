import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB database using Mongoose.
 * Logs a warning instead of crashing if MongoDB is not active, ensuring
 * that the server can still run in offline/mock mode.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vibevilaa');
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.warn('💡 The server is running successfully, but database queries will fail. Ensure MongoDB is running to use database operations.');
  }
};

export default connectDB;
