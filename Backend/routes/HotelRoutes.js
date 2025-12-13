import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js";
import { allowRole } from "../middlewares/roleMiddleware.js";
import {
  createHotel,
  deleteHotel,
  getHotelById,
  getHotelRooms,
  getHotels,
  updateHotel,
} from "../controllers/HotelController.js";
import upload from "../config/cloudinary.js";
import { hotelSchema } from "../utils/joiValidation.js";

const router = express.Router();

// admin
router.post(
  "/createHotel",
  authenticate,
  allowRole("admin"),
  hotelSchema,
  upload.single("image"),
  createHotel
);
router.put(
  "/updateHotel/:hotelId",
  authenticate,
  allowRole("admin"),
  hotelSchema,
  upload.single("image"),
  updateHotel
);
router.delete(
  "/deleteHotel/:hotelId",
  authenticate,
  allowRole("admin"),
  deleteHotel
);

// user
router.get("/getHotels", getHotels);
router.get("/getHotelById/:hotelId", getHotelById);
router.get("/getHotelRooms/:hotelId/rooms", getHotelRooms);

export default router;
