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
  const { name, bio, avatar, skills, githubUrl, linkedinUrl, portfolioUrl, location } = profileData;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (skills !== undefined) user.skills = skills;
  if (githubUrl !== undefined) user.githubUrl = githubUrl;
  if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
  if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
  if (location !== undefined) user.location = location;

  await user.save();

  return user;
};