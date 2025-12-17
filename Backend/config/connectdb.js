// import mongoose from "mongoose";
// import logger from "../utils/logger.js";
// import dotenv from "dotenv";
// dotenv.config();

// const connectdb = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL);

//     logger.info("Databse connected");
//   } catch (error) {
//     logger.error("Database connection error", error);
//   }
// };

// export default connectdb;

// Updated db.js with connection caching and timeout settings
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URL, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully to Vercel.");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection failed:", error);
        throw error;
      });
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise to allow a retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;
