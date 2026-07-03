import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";

import { toggleLike, getUserLikeStatus } from "../services/likeService.js";

export const likeProject = asyncHandler(async (req, res) => {
  const result = await toggleLike(
    req.params.projectId,
    req.user._id
  );

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      result.liked ? "Project liked" : "Like removed",
      result
    )
  );
});

export const getLikeStatus = asyncHandler(async (req, res) => {
  const liked = await getUserLikeStatus(
    req.params.projectId,
    req.user._id
  );

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Like status fetched", { liked })
  );
});