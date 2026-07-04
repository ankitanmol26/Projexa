import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  changeUserPassword,
  forgotPassword,
  resetPassword,
} from "../services/authService.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

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
  const profileData = { ...req.body };

  if (req.files) {
    if (req.files.avatar && req.files.avatar[0]) {
      const result = await uploadToCloudinary(req.files.avatar[0].buffer, "projexa/avatars", { resource_type: "image" });
      profileData.avatar = result.secure_url;
    }
    if (req.files.resume && req.files.resume[0]) {
      const result = await uploadToCloudinary(req.files.resume[0].buffer, "projexa/resumes", { resource_type: "auto" });
      profileData.resume = result.secure_url;
    }
  }

  const updatedUser = await updateUserProfile(req.user._id, profileData);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Profile updated successfully",
      updatedUser
    )
  );
});

/**
 * @desc    Change password for the logged-in user
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      new ApiResponse(HTTP_STATUS.BAD_REQUEST, "Both currentPassword and newPassword are required", null)
    );
  }

  if (newPassword.length < 8) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      new ApiResponse(HTTP_STATUS.BAD_REQUEST, "New password must be at least 8 characters", null)
    );
  }

  await changeUserPassword(req.user._id, currentPassword, newPassword);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Password changed successfully", null)
  );
});

/**
 * @desc    Initiate forgot-password flow
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPasswordHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      new ApiResponse(HTTP_STATUS.BAD_REQUEST, "Email is required", null)
    );
  }

  const resetToken = await forgotPassword(email);

  // Always return 200 to prevent email enumeration
  // In production: send an email here with the reset link
  // For development: we return the token directly in the response body
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "If that email is registered you will receive a reset link", {
      // DEVELOPMENT ONLY — remove in production
      resetToken: process.env.NODE_ENV !== "production" ? resetToken : undefined,
    })
  );
});

/**
 * @desc    Reset password with token
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      new ApiResponse(HTTP_STATUS.BAD_REQUEST, "New password is required", null)
    );
  }

  await resetPassword(token, password);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Password reset successfully. Please log in.", null)
  );
});