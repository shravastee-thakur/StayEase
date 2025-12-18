// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.resend.com",
//   port: 465,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.RESEND_API_KEY,
//   },
// });

// transporter.verify(function (error) {
//   if (error) {
//     console.error("SMTP Connection Error:", error);
//   } else {
//     console.log("SMTP Server is ready to take messages");
//   }
// });

// export default transporter;

import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

export const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendOtpEmail = async (email, otp) => {
//   try {
//     const emailResponse = await resend.emails.send({
//       from: process.env.SENDER_EMAIL,
//       to: email,
//       subject: "Your 2FA Login OTP",
//       html: `
//         <p>Login Verification</p>
//         <p>Your OTP for login is:</p>
//         <h2><strong>${otp}</strong></h2>
//         <p>This OTP will expire in 5 minutes.</p>
//       `,
//     });

//     console.log("Email sent response:", emailResponse);
//     return emailResponse;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };

// export const sendResetPasswordEmail = async (email, resetLink) => {
//   try {
//     const response = await resend.emails.send({
//       from: process.env.SENDER_EMAIL,
//       to: email,
//       subject: "Password Reset Request",
//       html: `
//         <h2>Password Reset</h2>
//         <p>Click the link below to verify your account:</p>
//         <a href="${resetLink}" style="padding:10px 15px;background:#4f46e5;color:#fff; border-radius:4px;text-decoration:none;">Verify Email</a>
//         <p>This link will expire in 5 minutes.</p>
//       `,
//     });
//     return response;
//   } catch (error) {
//     console.error("Error sending reset password email:", error);
//     throw error;
//   }
// };
