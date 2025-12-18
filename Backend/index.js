import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectdb from "./config/connectdb.js";

import logger from "./utils/logger.js";

import { errorHandler } from "./middlewares/errorMiddleware.js";
import userRoute from "./routes/UserRoutes.js";
import hotelRoute from "./routes/HotelRoutes.js";
import roomRoute from "./routes/RoomRoutes.js";
import bookingRoute from "./routes/BookingRoute.js";
import { redis } from "./config/redis.js";

const app = express();
connectdb();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://shra-stayease.netlify.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

export const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/test-email", async (req, res) => {
  try {
    console.log("🧪 Testing Resend directly...");
    const testEmail = "shratestcode@gmail.com"; // ← YOUR email

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [testEmail],
      subject: "Render Test Email",
      html: "<h1>Render + Resend is working!</h1>",
    });

    console.log("✅ Test email sent:", response.data?.id);
    return res.json({ ok: true, id: response.data?.id });
  } catch (err) {
    console.error("❌ Test email failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

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
