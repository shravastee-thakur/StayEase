import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  forgetPassword,
  loginStepOne,
  logout,
  refreshHandler,
  register,
  resetPassword,
  verifyOtp,
} from "../controllers/UserController.js";
import {
  loginSchema,
  otpValidationSchema,
  registerSchema,
} from "../utils/joiValidation.js";

const router = express.Router();

router.post("/register", registerSchema, register);
router.post("/loginStepOne", loginSchema, loginStepOne);
router.post("/verifyOtp", otpValidationSchema, verifyOtp);
router.post("/refreshHandler", refreshHandler);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.post("/logout", authenticate, logout);

export default router;
