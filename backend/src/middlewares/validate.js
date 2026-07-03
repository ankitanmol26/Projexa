import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array().map(error => error.msg).join(", ");

    return next(
      new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        message
      )
    );
  }

  next();
};

export default validate;