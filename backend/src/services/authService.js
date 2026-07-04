import crypto from 'crypto';
import User from "../models/user.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import HTTP_STATUS from "../constants/httpStatus.js";

export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "Email is already registered"
    );
  }

  // Create new user
  const createdUser = await User.create({
    name,
    email,
    password,
    role,
  });

  // Fetch user without password
  const user = await User.findById(createdUser._id);

  // Generate JWT
  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  user.password = undefined;

  return {
    user,
    token,
  };
};

export const updateUserProfile = async (userId, profileData) => {
  const {
    name, bio, avatar, resume, skills,
    githubUrl, linkedinUrl, portfolioUrl,
    location, college, branch, graduationYear, coverImage,
  } = profileData;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  // Only update fields that were explicitly sent
  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (resume !== undefined) user.resume = resume;
  if (skills !== undefined) user.skills = skills;
  if (githubUrl !== undefined) user.githubUrl = githubUrl;
  if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
  if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
  if (location !== undefined) user.location = location;
  if (college !== undefined) user.college = college;
  if (branch !== undefined) user.branch = branch;
  if (graduationYear !== undefined) user.graduationYear = graduationYear;
  if (coverImage !== undefined) user.coverImage = coverImage;

  await user.save();

  return user;
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  const isCorrect = await user.comparePassword(currentPassword);
  if (!isCorrect) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
};

/**
 * Forgot password — generates a reset token and returns it (caller can send via email).
 * In development the token is returned directly so it can be tested without an email service.
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Return silently to avoid email enumeration
    return null;
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  return resetToken;
};

/**
 * Reset password — verifies the token, checks expiry, updates password.
 */
export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire +password');

  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset token');
  }

  if (!newPassword || newPassword.length < 8) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Password must be at least 8 characters');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};