import joi from "joi";

export const registerSchema = (req, res, next) => {
  const schema = joi.object({
    username: joi.string().required().trim().messages({
      "string.empty": "Username is required",
    }),
    email: joi.string().email().trim().required().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
    password: joi.string().min(6).max(14).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
    // role: joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};

export const loginSchema = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().trim().required().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
    password: joi.string().min(6).max(14).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};

export const otpValidationSchema = (req, res, next) => {
  const schema = joi.object({
    userId: joi.string().required().messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
    }),

    otp: joi.string().length(6).required().messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "any.required": "OTP is required",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};

export const roomSchema = (req, res, next) => {
  const schema = joi.object({
    type: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required(),
    maxPeople: joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

export const hotelSchema = () => {
  const schema = joi.object({
    name: joi.string().required(),
    city: joi.string().required(),
    address: joi.string().required(),
    distance: joi.string().required(),
    description: joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
};
