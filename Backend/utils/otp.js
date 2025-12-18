import { redis } from "../config/redis.js";

export const saveOtp = async (email, otp) => {
  return await redis.set(`otp:${email}`, otp, { EX: 300 });
};

export const getOtp = async (email) => {
  return await redis.get(`otp:${email}`);
};

export const deleteOtp = async (email) => {
  return await redis.del(`otp:${email}`);
};

redis.on("connect", () => {
  console.log("Redis is connected");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});
