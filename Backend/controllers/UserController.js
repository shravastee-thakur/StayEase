import sanitize from "mongo-sanitize";
import User from "../models/UserModel.js";
import logger from "../utils/logger.js";
import { rateLimit } from "../utils/rateLimit.js";
import { deleteOtp, getOtp, saveOtp } from "../utils/otp.js";
// import transporter from "../config/sendMail.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtTokens.js";
import crypto from "crypto";
import {
  deleteResetToken,
  getResetToken,
  saveResetToken,
} from "../utils/resetToken.js";
// import { sendOtpEmail, sendResetPasswordEmail } from "../config/sendMail.js";

import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

export const resend = new Resend(process.env.RESEND_API_KEY);
console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL);

export const register = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { username, email, password } = sanitizeBody;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      // role
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        // role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Error during register : ${error.message}`);
    next(error);
  }
};

export const loginStepOne = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email, password } = sanitizeBody;

    // rate limit
    const key = `login:${req.ip}:${email}`;
    const isLimited = await rateLimit(key, 3, 300);
    if (isLimited) {
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Try again later.",
      });
    }

    const user = await User.login(email, password);

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    console.log("Saving OTP in Redis...");
    await saveOtp(email, otp);
    console.log("OTP saved in Redis.");

    // const mailOption = {
    //   from: process.env.SENDER_EMAIL,
    //   to: user.email,
    //   subject: "Your 2FA Login OTP",
    //   html: `
    //     <p>Login Verification</p>
    //     <p>Your OTP for login is:</p>
    //     <h2><strong>${otp}</strong></h2>
    //     <p>This OTP will expire in 5 minutes.</p>
    //   `,
    // };

    // await transporter.sendMail(mailOption);

    const emailResponse = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: [user.email],
      subject: "Your 2FA Login OTP",
      html: `
            <p>Login Verification</p>
            <p>Your OTP for login is:</p>
            <h2><strong>${otp}</strong></h2>
            <p>This OTP will expire in 5 minutes.</p>
          `,
    });

    console.log("Email sent response:", emailResponse);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify.",
      userId: user._id,
    });
  } catch (error) {
    logger.error(`Error during login : ${error.message}`);
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { userId, otp } = sanitizeBody;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or OTP",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const storedOtp = await getOtp(user.email);
    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid",
      });
    }

    if (String(storedOtp) !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP. Try again.",
      });
    }

    await deleteOtp(user.email);

    if (!user.isVerified) {
      user.isVerified = true;
    }

    const newaccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    await user.save();

    return res
      .status(201)
      .cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        accessToken: newaccessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          verified: user.isVerified,
        },
      });
  } catch (error) {
    logger.error(`Error during verify otp : ${error.message}`);
    next(error);
  }
};

export const refreshHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid Token" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findOne({ _id: decoded.id, refreshToken });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const newaccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    await user.save();

    return res
      .status(201)
      .cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        accessToken: newaccessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          verified: user.isVerified,
        },
      });
  } catch (error) {
    logger.error(`Error during refresh handler : ${error.message}`);
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email } = sanitizeBody;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(409).json({
        success: false,
        message: "User does not exists",
      });
    }

    const key = `forget-pw:${email}`;
    const isLimited = await rateLimit(key, 3, 300);
    if (isLimited) {
      return res.status(429).json({
        success: false,
        message: "Too many password reset attempts. Try again later.",
      });
    }

    const resetToken = crypto.randomBytes(10).toString("hex");
    const hashToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await saveResetToken(userExists.id.toString(), hashToken);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&userId=${userExists.id}`;

    // const mailOptions = {
    //   from: process.env.SENDER_EMAIL,
    //   to: email,
    //   subject: "Password Reset Request",
    //   html: `
    //     <h2>Password Reset</h2>
    //     <p>Click the link below to verify your account:</p>
    //     <a href="${resetLink}" style="padding:10px 15px;background:#4f46e5;color:#fff;   border-radius:4px;text-decoration:none;">
    //   Verify Email
    //     </a>
    //     <p>This link will expire in 5 minutes.</p>
    //   `,
    // };

    // await transporter.sendMail(mailOptions);

    const response = await resend.emails.send({
      from: 'StayEase <onboarding@resend.dev>',
      to: [userExists.email],
      subject: "Password Reset Request",
      html: `
            <h2>Password Reset</h2>
            <p>Click the link below to verify your account:</p>
            <a href="${resetLink}" style="padding:10px 15px;background:#4f46e5;color:#fff; border-radius:4px;text-decoration:none;">Verify Email</a>
            <p>This link will expire in 5 minutes.</p>
          `,
    });

    return res.status(201).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    logger.error(`Error during forget password : ${error.message}`);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { userId, token, newPassword } = sanitizeBody;

    if (!userId || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "User ID, token and new password are required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const storedResetToken = await getResetToken(userId);
    if (!storedResetToken) {
      return res.status(400).json({
        success: false,
        message: "Token expired or invalid",
      });
    }

    if (storedResetToken !== hashedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = newPassword;
    await user.save();

    await deleteResetToken(userId);

    return res.status(201).json({
      success: true,
      message: "Password has been successfully reset.",
    });
  } catch (error) {
    next(error);
    logger.error(`Error during reset password : ${error.message}`);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    const user = await User.findOne({ refreshToken: token });

    if (user) {
      user.refreshToken = "";
      user.isVerified = false;
      await user.save();
    }

    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
    logger.error(`Error during logout : ${error.message}`);
  }
};
