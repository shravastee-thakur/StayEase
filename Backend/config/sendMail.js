// import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

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

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email, otp) => {
  try {
    const emailResponse = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your 2FA Login OTP",
      html: `
        <p>Login Verification</p>
        <p>Your OTP for login is:</p>
        <h2><strong>${otp}</strong></h2>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
