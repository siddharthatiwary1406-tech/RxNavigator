const mongoose = require('mongoose');

// Reuse connection across serverless warm invocations
let cachedConn = null;

const connectDB = async () => {
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    });
    cachedConn = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Throw instead of process.exit — safe for serverless
    throw error;
  }
};

module.exports = connectDB;
