import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";

import {
  createProject,
  getAllProjects,
  getProjectById,
} from "../services/projectService.js";

export const create = asyncHandler(async (req, res) => {
  const project = await createProject(
    req.body,
    req.user._id
  );

  return res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(
      HTTP_STATUS.CREATED,
      "Project created successfully",
      project
    )
  );
});

export const getAll = asyncHandler(async (req, res) => {
  const projects = await getAllProjects();

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      "Projects fetched successfully",
      projects
    )
  );
});

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