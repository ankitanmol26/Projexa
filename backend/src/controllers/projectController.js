import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";

import {
  createProject,
  getAllProjects,
  getProjectById,
  getMyProjects,
  updateProject,
  deleteProject,
} from "../services/projectService.js";

// Create Project
export const create = asyncHandler(async (req, res) => {
  const project = await createProject(req.body, req.user._id);

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(
      HTTP_STATUS.CREATED,
      "Project created successfully",
      project
    )
  );
});

// Get All Projects
export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllProjects(req.query);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Projects fetched successfully",
      result
    )
  );
});

// Get Project By ID
export const getOne = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.id);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Project fetched successfully",
      project
    )
  );
});

// Get Logged-in User Projects
export const getMine = asyncHandler(async (req, res) => {
  const projects = await getMyProjects(req.user._id);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Your projects fetched successfully",
      projects
    )
  );
});

// Update Project
export const update = asyncHandler(async (req, res) => {
  const project = await updateProject(
    req.params.id,
    req.user._id,
    req.body
  );

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Project updated successfully",
      project
    )
  );
});

// Delete Project
export const remove = asyncHandler(async (req, res) => {
  await deleteProject(req.params.id, req.user._id);

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Project deleted successfully",
      null
    )
  );
});