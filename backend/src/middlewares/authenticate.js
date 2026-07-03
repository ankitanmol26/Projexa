import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Access denied. No token provided."
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "User not found."
    );
  }

  req.user = user;

  next();
});

export default authenticate;