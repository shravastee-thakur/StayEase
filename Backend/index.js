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
import hotelRoute from "./routes/HotelRoutes.js";
import roomRoute from "./routes/RoomRoutes.js";
import bookingRoute from "./routes/BookingRoute.js";

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
app.use("/api/v1/users", userRoute);
// http://localhost:8000/api/v1/users/register

app.use("/api/v1/hotels", hotelRoute);
// http://localhost:8000/api/v1/hotels/createHotel

app.use("/api/v1/rooms", roomRoute);
// http://localhost:8000/api/v1/rooms/createRoom

app.use("/api/v1/bookings", bookingRoute);
// http://localhost:8000/api/v1/bookings/createBooking

app.use((req, res, next) => {
  next({ statusCode: 404, message: `Route not found: ${req.originalUrl}` });
});

app.use(errorHandler);
app.listen(PORT, () => {
  logger.info(`Server is running on port: http://localhost:${PORT}`);
});
