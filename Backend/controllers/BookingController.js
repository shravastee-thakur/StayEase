import Booking from "../models/BookingModel.js";
import Hotel from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";
import logger from "../utils/logger.js";
import sanitize from "mongo-sanitize";
import { Stripe } from "stripe";
// import transporter from "../config/sendMail.js";
import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY);

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createBooking = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { roomId, hotelId, startDate, endDate, totalAmount } = sanitizeBody;

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
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
      ],
    });

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Room is already booked for the selected dates",
      });
    }

    const booking = await Booking.create({
      userId: req.user.id,
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
      .select("userId roomId hotelId startDate endDate totalAmount status")
      .populate("userId", "email")
      .populate("roomId", "type -_id")
      .populate("hotelId", "name city -_id")
      .sort({ createdAt: -1 });

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
      .select("roomId hotelId startDate endDate totalAmount status")
      .populate("roomId", "type -_id")
      .populate("hotelId", "name city -_id")
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
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
      ],
    });

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

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

export const stripePayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .select("userId hotelId totalAmount startDate")
      .populate("userId", "username email -_id")
      .populate("hotelId", "name city -_id");
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const amountToCharge = booking.totalAmount;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: booking.hotelId.name,
            },
            unit_amount: amountToCharge * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failure`,
    });

    await booking.updateOne({ status: "confirmed" });

    // const mailOption = {
    //   from: process.env.SENDER_EMAIL,
    //   to: booking.userId.email,
    //   subject: "Hotel Booking Details",
    //   html: `
    //         <h2>Booking Details</h2>
    //         <p>Dear ${booking.userId.username},</p>
    //         <p>Thankyou for availing our service.</p>
    //         <ul>
    //           <li><strong>Booking ID: </strong>${bookingId}</li>
    //           <li><strong>Hotel Name: </strong>${booking.hotelId.name}</li>
    //           <li><strong>Location: </strong>${booking.hotelId.city}</li>
    //           <li><strong>Date: </strong>${booking.startDate.toLocaleDateString(
    //             "en-GB"
    //           )}</li>
    //           <li><strong>Total Amount: </strong>₹ ${booking.totalAmount.toLocaleString()}</li>
    //         </ul>
    //         <p>We look forward to welcome you.</p>
    //       `,
    // };

    // await transporter.sendMail(mailOption);

    const emailResponse = await resend.emails.send({
      from: "StayEase <onboarding@resend.dev>",
      to: booking.userId.email,
      subject: "Hotel Booking Details",
      html: `
        <h2>Booking Details</h2>
        <p>Dear ${booking.userId.username},</p>
        <p>Thank you for availing our service.</p>
        <ul>
          <li><strong>Booking ID: </strong>${bookingId}</li>
          <li><strong>Hotel Name: </strong>${booking.hotelId.name}</li>
          <li><strong>Location: </strong>${booking.hotelId.city}</li>
          <li><strong>Date: </strong>${booking.startDate.toLocaleDateString(
            "en-GB"
          )}</li>
          <li><strong>Total Amount: </strong>₹ ${booking.totalAmount.toLocaleString()}</li>
        </ul>
        <p>We look forward to welcoming you.</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    res.json({ success: true, url: session.url });
  } catch (error) {
    logger.error(`Error in stripe payment: ${error.message}`);
    next(error);
  }
};
