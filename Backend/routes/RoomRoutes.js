import express from "express";
import { allowRole } from "../middlewares/roleMiddleware.js";
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
} from "../controllers/RoomController.js";

const router = express.Router();

router.post("/createRoom/:id", allowRole("admin"), createRoom);
router.get("/getRooms", getRooms);
router.get("/getRoomById/:id", getRoomById);
router.put("/updateRoom/:id", allowRole("admin"), updateRoom);
router.delete("/deleteRoom/:id", allowRole("admin"), deleteRoom);

export default router;
