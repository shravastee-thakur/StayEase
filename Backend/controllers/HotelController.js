import { uploadImageToCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";
import logger from "../utils/logger.js";
import sanitize from "mongo-sanitize";

export const createHotel = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { name, city, address, distance, description } = sanitizeBody;
    if (!name || !city || !address || !distance || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Some fields are not filled" });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Hotel image is required",
      });
    }

    const uploadImage = await uploadImageToCloudinary(req.file.buffer);

    const hotel = await Hotel.create({
      name,
      city,
      address,
      distance,
      image: {
        url: uploadImage.secure_url,
        public_id: uploadImage.public_id,
      },
      description,
    });
    return res.status(201).json({
      success: true,
      hotel,
      message: "Hotel created successfully",
    });
  } catch (error) {
    logger.error(`Error in create hotel: ${error.message}`);
    next(error);
  }
};

export const getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    if (!hotels) {
      return res
        .status(404)
        .json({ success: false, message: "Hotels not found" });
    }

    return res.status(200).json({
      success: true,
      hotels,
      message: "Hotels fetched successfully",
    });
  } catch (error) {
    logger.error(`Error in get hotels: ${error.message}`);
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    return res.status(200).json({
      success: true,
      hotel,
      message: "Hotel fetched successfully",
    });
  } catch (error) {
    logger.error(`Error in get hotel by id: ${error.message}`);
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    req.body = sanitize(req.body);
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    let updatedImage = hotel.image;

    if (req.file) {
      if (hotel.image && hotel.image.public_id) {
        try {
          await cloudinary.uploader.destroy(hotel.image.public_id);
        } catch (cloudinaryError) {
          logger.error(
            `Error deleting image from Cloudinary: ${cloudinaryError.message}`
          );
        }
      }

      const uploadImage = await uploadImageToCloudinary(req.file.buffer);
      updatedImage = {
        url: uploadImage.secure_url,
        public_id: uploadImage.public_id,
      };
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      {
        name: req.body.name || hotel.name,
        city: req.body.city || hotel.city,
        address: req.body.address || hotel.address,
        distance: req.body.distance || hotel.distance,
        image: updatedImage,
        description: req.body.description || hotel.description,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      updatedHotel,
    });
  } catch (error) {
    logger.error(`Error in update hotel: ${error.message}`);
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    if (hotel.image && hotel.image.public_id) {
      try {
        await cloudinary.uploader.destroy(hotel.image.public_id);
      } catch (cloudinaryError) {
        logger.error(
          `Error deleting image from Cloudinary: ${cloudinaryError.message}`
        );
      }
    }

    const hotelRooms = await Room.find({ hotelId });
    for (const room of hotelRooms) {
      if (room.image && room.image.public_id) {
        try {
          await cloudinary.uploader.destroy(room.image.public_id);
        } catch (roomImageError) {
          logger.error(
            `Error deleting room image from Cloudinary for room ${room._id}: ${roomImageError.message}`
          );
        }
      }
    }

    await Room.deleteMany({ hotelId });

    const deleteHotel = await Hotel.findByIdAndDelete(hotelId);

    return res.status(200).json({
      success: true,
      message: "Hotel and associated rooms deleted successfully",
    });
  } catch (error) {
    logger.error(`Error in delete hotel: ${error.message}`);
    next(error);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    const rooms = await Room.find({ hotelId: hotelId });

    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    logger.error(`Error in get hotel rooms: ${error.message}`);
    next(error);
  }
};
