import Like from "../models/Like.js";
import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

// Check if the current user has already liked a project
export const getUserLikeStatus = async (projectId, userId) => {
  const existing = await Like.findOne({ user: userId, project: projectId });
  return !!existing;
};

// Toggle Like — add if missing, remove if present
export const toggleLike = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Project not found");
  }

  const existingLike = await Like.findOne({
    user: userId,
    project: projectId,
  });

  let liked;

  if (existingLike) {
    await existingLike.deleteOne();
    liked = false;
  } else {
    await Like.create({ user: userId, project: projectId });
    liked = true;
  }

  const totalLikes = await Like.countDocuments({ project: projectId });

  // Keep Project.likes in sync so cards always show the correct count
  await Project.findByIdAndUpdate(projectId, { likes: totalLikes });

  return { likes: totalLikes, liked };
};
