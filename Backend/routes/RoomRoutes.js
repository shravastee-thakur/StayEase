import express from "express";
import { allowRole } from "../middlewares/roleMiddleware.js";
import {
  createRoom,
  deleteRoom,
  getRoombyId,
  updateRoom,
} from "../controllers/RoomController.js";
import { roomSchema } from "../utils/joiValidation.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.get("/getRoomById/:roomId", getRoombyId);

// admin
router.post(
  "/createRoom",
  authenticate,
  allowRole("admin"),
  roomSchema,
  upload.single("image"),
  createRoom
);

router.put(
  "/updateRoom/:roomId",
  authenticate,
  allowRole("admin"),
  roomSchema,
  upload.single("image"),
  updateRoom
);

router.delete(
  "/deleteRoom/:roomId",
  authenticate,
  allowRole("admin"),
  deleteRoom
);

export default router;
