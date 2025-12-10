import express from "express";

import {
  createHotel,
  deleteHotel,
  getHotelById,
  getHotels,
  updateHotel,
} from "../controllers/HotelController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { allowRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/createHotel", authenticate, allowRole("admin"), createHotel);
router.get("/getHotels", getHotels);
router.get("/getHotelById/:id", getHotelById);
router.put("/updateHotel/:id", authenticate, allowRole("admin"), updateHotel);
router.delete(
  "/deleteHotel/:id",
  authenticate,
  allowRole("admin"),
  deleteHotel
);

export default router;
