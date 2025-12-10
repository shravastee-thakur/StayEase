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

const router = express.Router();

router.post(
  "/createHotel",
  authenticate,
  allowRole("admin"),
  upload.single("image"),
  createHotel
);
router.get("/getHotels", getHotels);
router.get("/getHotelById/:id", getHotelById);
router.get("/getHotelRooms/:id/rooms", getHotelRooms);
router.put(
  "/updateHotel/:id",
  authenticate,
  allowRole("admin"),
  upload.single("image"),
  updateHotel
);
router.delete(
  "/deleteHotel/:id",
  authenticate,
  allowRole("admin"),
  deleteHotel
);

export default router;
