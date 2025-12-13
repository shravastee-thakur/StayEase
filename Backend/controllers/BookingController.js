import Booking from "../models/BookingModel.js";
import Hotel from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";
import logger from "../utils/logger.js";
import sanitize from "mongo-sanitize";

export const createBooking = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { userId, roomId, hotelId, startDate, endDate, totalAmount } =
      sanitizeBody;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const overlappingBookings = await Booking.find({
      roomId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Room is already booked for the selected dates",
      });
    }

    const booking = await Booking.create({
      userId: req.user.id || userId,
      hotelId,
      roomId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalAmount,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      booking,
      message: "Booking created successfully",
    });
  } catch (error) {
    logger.error(`Error in create booking: ${error.message}`);
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const { status, userId, hotelId, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (hotelId) query.hotelId = hotelId;

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("roomId", "type price maxPeople")
      .populate("hotelId", "name city address");

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    logger.error(`Error in get all bookings: ${error.message}`);
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId })
      .populate("roomId", "type price maxPeople")
      .populate("hotelId", "name city address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    logger.error(`Error in get my booking: ${error.message}`);
    next(error);
  }
};

// export const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate('userId', 'name email')
//       .populate('roomId', 'type price maxPeople image description')
//       .populate('hotelId', 'name city address image description rating');

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     // Check if user is authorized to view this booking
//     // (User can view their own booking, admin can view any)
//     if (booking.userId._id.toString() !== req.user.id && !req.user.isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to view this booking'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: booking
//     });
//   } catch (error) {
//     console.error('Get booking by ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      success: true,
      booking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    logger.error(`Error in cancel booking: ${error.message}`);
    next(error);
  }
};

export const checkRoomAvailability = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide startDate and endDate query parameters",
      });
    }

    const overlappingBookings = await Booking.find({
      roomId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    const isAvailable = overlappingBookings.length === 0;

    return res.status(200).json({
      success: true,
      data: {
        isAvailable,
        conflictingBookings: overlappingBookings.map((booking) => ({
          startDate: booking.startDate,
          endDate: booking.endDate,
          status: booking.status,
        })),
      },
    });
  } catch (error) {
    logger.error(`Error in check room availability: ${error.message}`);
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await Booking.findByIdAndDelete(bookingId);
    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    logger.error(`Error in delete booking: ${error.message}`);
    next(error);
  }
};
