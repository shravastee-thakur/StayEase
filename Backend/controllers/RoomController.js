import sanitize from "mongo-sanitize";
import { uploadImageToCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";
import logger from "../utils/logger.js";

export const createRoom = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { hotelId, type, description, price, maxPeople } = sanitizeBody;
    if (!hotelId || !type || !description || !price || !maxPeople) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Room image is required",
      });
    }

    const uploadImg = await uploadImageToCloudinary(req.file.buffer);

    const room = await Room.create({
      hotelId,
      image: {
        url: uploadImg.secure_url,
        public_id: uploadImg.public_id,
      },
      type,
      description,
      price,
      maxPeople,
    });

    return res
      .status(201)
      .json({ success: true, message: "Room created successfully", room });
  } catch (error) {
    next(error);
    logger.error(`Error in create room: ${error.message}`);
  }
};

export const getRoombyId = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId).populate("hotelId", "name city");
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({ success: true, room });
  } catch (error) {
    next(error);
    logger.error(`Error in get room by id: ${error.message}`);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    req.body = sanitize(req.body);
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    let updatedImage = room.image;

    if (req.file) {
      if (room.image && room.image.public_id) {
        try {
          await cloudinary.uploader.destroy(room.image.public_id);
        } catch (cloudinaryError) {
          logger.error(`Error deleting old image: ${cloudinaryError.message}`);
        }
      }
      const uploadImage = await uploadImageToCloudinary(req.file.buffer);
      updatedImage = {
        url: uploadImage.secure_url,
        public_id: uploadImage.public_id,
      };
    }

    const updateRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        image: updatedImage,
        type: req.body.type || room.type,
        description: req.body.description || room.description,
        price: req.body.price || room.price,
        maxPeople: req.body.maxPeople || room.maxPeople,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      updateRoom,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in update room: ${error.message}`);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.image && room.image.public_id) {
      try {
        await cloudinary.uploader.destroy(room.image.public_id);
      } catch (cloudinaryError) {
        logger.error(
          `Error deleting image from Cloudinary: ${cloudinaryError.message}`
        );
      }
    }

    await Room.findByIdAndDelete(roomId);

    return res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    next(error);
    logger.error(`Error in delete room: ${error.message}`);
  }
};
