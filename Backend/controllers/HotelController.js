import { uploadImageToCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";
import logger from "../utils/logger.js";

export const createHotel = async (req, res, next) => {
  try {
    const { name, city, address, distance, image, desc } = req.body;
    if (!name || !city || !address || !distance || !desc) {
      return res
        .status(400)
        .json({ success: false, message: "Some fields are not filled" });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
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

      desc,
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
    const id = req.params.id;
    const hotel = await Hotel.findById(id);
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
    const id = req.params.id;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    let updatedImage = hotel.image;

    if (req.file) {
      if (hotel.image && hotel.image[0]?.public_id) {
        await cloudinary.uploader.destroy(hotel.image[0].public_id);
      }
      const uploadImage = await uploadImageToCloudinary(req.file.buffer);
      updatedImage = {
        url: uploadImage.secure_url,
        public_id: uploadImage.public_id,
      };
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        name: req.body.name || hotel.name,
        city: req.body.city || hotel.city,
        address: req.body.address || hotel.address,
        distance: req.body.distance || hotel.distance,
        image: updatedImage,
        desc: req.body.desc || hotel.desc,
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
    const id = req.params.id;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }
    await Room.deleteMany({ hotelId: id });

    const deleteHotel = await Hotel.findByIdAndDelete(id);

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
    const id = req.params.id;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    const rooms = await Room.find({ hotelId: id });

    return res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    logger.error(`Error in get hotel rooms: ${error.message}`);
    next(error);
  }
};
