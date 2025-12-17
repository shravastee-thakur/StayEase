import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,

      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 10000,

      waitQueueTimeoutMS: 30000, // Timeout for operations waiting for a connection
      maxTimeMS: 30000,
    });
    logger.info("Databse connected");
  } catch (error) {
    logger.error("Database connection error", error);
  }
};

export default connectdb;
