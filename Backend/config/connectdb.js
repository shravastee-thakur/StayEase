import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info("Databse connected");
  } catch (error) {
    logger.error("Database connection error", error);
  }
};

export default connectdb;
