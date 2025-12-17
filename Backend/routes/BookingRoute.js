import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { allowRole } from "../middlewares/roleMiddleware.js";
import {
  cancelBooking,
  checkRoomAvailability,
  createBooking,
  deleteBooking,
  getAllBookings,
  getMyBookings,
  stripePayment,
} from "../controllers/BookingController.js";

const router = express.Router();

// user
router.post("/createBooking", authenticate, createBooking);
router.get("/getMyBookings", authenticate, getMyBookings);
router.get(
  "/checkRoomAvailability/:roomId",
  authenticate,
  checkRoomAvailability
);
router.put("/cancelBooking/:bookingId", authenticate, cancelBooking);
router.post("/payment", authenticate, stripePayment);

//admin
router.get("/getAllBookings", authenticate, allowRole("admin"), getAllBookings);
router.delete(
  "/deleteBooking/:bookingId",
  authenticate,
  allowRole("admin"),
  deleteBooking
);

export default router;
