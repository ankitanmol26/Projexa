import Comment from "../models/Comment.js";
import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import { createNotification } from "./notificationService.js";

// Create Comment
export const createComment = async (projectId, authorId, content) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Project not found");
  }

  const comment = await Comment.create({
    content,
    author: authorId,
    project: projectId,
  });

  // Keep commentsCount in sync
  const totalComments = await Comment.countDocuments({ project: projectId });
  await Project.findByIdAndUpdate(projectId, { commentsCount: totalComments });

  // Notify the project owner (fire-and-forget)
  const preview = content.length > 80 ? content.substring(0, 80) + '…' : content;
  createNotification({
    recipient: project.owner,
    sender: authorId,
    type: "comment",
    project: projectId,
    message: preview,
  }).catch(() => {});

  return await comment.populate("author", "name email");
};

// Get Comments of a Project
export const getProjectComments = async (projectId) => {
  return await Comment.find({ project: projectId })
    .populate("author", "name email")
    .sort({ createdAt: -1 });
};

// Update Comment
export const updateComment = async (commentId, authorId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Comment not found");
  }
  if (comment.author.toString() !== authorId.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "You can update only your own comments");
  }

  comment.content = content;
  await comment.save();
  return await comment.populate("author", "name email");
};

// Delete Comment
export const deleteComment = async (commentId, authorId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Comment not found");
  }
  if (comment.author.toString() !== authorId.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "You can delete only your own comments");
  }

  const projectId = comment.project;
  await comment.deleteOne();

  // Keep commentsCount in sync
  const totalComments = await Comment.countDocuments({ project: projectId });
  await Project.findByIdAndUpdate(projectId, { commentsCount: totalComments });

  return true;
};
