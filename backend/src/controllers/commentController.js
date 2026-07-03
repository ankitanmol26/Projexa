import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";

import {
  createComment,
  getProjectComments,
  updateComment,
  deleteComment,
} from "../services/commentService.js";

// Create Comment
export const create = asyncHandler(async (req, res) => {
  const comment = await createComment(
    req.params.projectId,
    req.user._id,
    req.body.content
  );

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(
      HTTP_STATUS.CREATED,
      "Comment created successfully",
      comment
    )
  );
});

// Get Comments of a Project
export const getAll = asyncHandler(async (req, res) => {
  const comments = await getProjectComments(req.params.projectId);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Comments fetched successfully",
      comments
    )
  );
});

// Update Comment
export const update = asyncHandler(async (req, res) => {
  const comment = await updateComment(
    req.params.id,
    req.user._id,
    req.body.content
  );

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Comment updated successfully",
      comment
    )
  );
});

// Delete Comment
export const remove = asyncHandler(async (req, res) => {
  await deleteComment(
    req.params.id,
    req.user._id
  );

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Comment deleted successfully",
      null
    )
  );
});