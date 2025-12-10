import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectdb from "./config/connectdb.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
dotenv.config();
import { errorHandler } from "./middlewares/errorMiddleware.js";

import userRoute from "./routes/UserRoutes.js";
// import hotelRoute from "./routes/HotelRoutes.js";

const app = express();
connectdb();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Routes
app.use("/api/v1/user", userRoute);
// http://localhost:8000/api/v1/user/register

// app.use("/api/v1/hotel", hotelRoute);
// http://localhost:8000/api/v1/hotel/createHotel

app.use((req, res, next) => {
  next({ statusCode: 404, message: `Route not found: ${req.originalUrl}` });
});

app.use(errorHandler);
app.listen(PORT, () => {
  logger.info(`Server is running on port: http://localhost:${PORT}`);
});
