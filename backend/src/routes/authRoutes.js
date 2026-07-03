import express from "express";

import {
  register,
  login,
  getMe,
  updateProfile,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
} from "../validations/authValidation.js";

import validate from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";

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
  updateProfile
);

export default router;