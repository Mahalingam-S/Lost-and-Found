const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_lost_found', {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}. Operating with in-memory storage fallback mode.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
