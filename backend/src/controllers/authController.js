import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import {
  registerUser,
  loginUser,
  updateUserProfile,
} from "../services/authService.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(
      HTTP_STATUS.CREATED,
      "User registered successfully",
      {
        user,
        token,
      }
    )
  );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Login successful",
      {
        user,
        token,
      }
    )
  );
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "User profile fetched successfully",
      req.user
    )
  );
});

/**
 * @desc    Update current logged-in user profile
 * @route   PUT /api/v1/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserProfile(req.user._id, req.body);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Profile updated successfully",
      updatedUser
    )
  );
});