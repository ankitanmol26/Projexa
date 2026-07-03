import User from "../models/User.js";
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