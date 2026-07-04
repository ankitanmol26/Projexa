import express from "express";

import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
} from "../validations/authValidation.js";

import validate from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const parseSkills = (req, res, next) => {
  if (req.body.skills && typeof req.body.skills === "string") {
    try {
      req.body.skills = JSON.parse(req.body.skills);
    } catch (err) {
      // Ignore
    }
  }
  next();
};

const router = express.Router();

// ==========================
// Public Routes
// ==========================

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  register
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  login
);

// Forgot Password
router.post("/forgot-password", forgotPasswordHandler);

// Reset Password
router.post("/reset-password/:token", resetPasswordHandler);

// ==========================
// Protected Routes
// ==========================

// Get Current Logged-in User
router.get(
  "/me",
  authenticate,
  getMe
);

// Update Profile Detail
router.put(
  "/profile",
  authenticate,
  upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]),
  parseSkills,
  updateProfile
);

// Change Password
router.put(
  "/change-password",
  authenticate,
  changePassword
);

export default router;