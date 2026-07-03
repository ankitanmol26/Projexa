import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

// Create Project
export const createProject = async (projectData, ownerId) => {
  const project = await Project.create({
    ...projectData,
    owner: ownerId,
  });

  return project.populate("owner", "name email role");
};

// Get All Projects
export const getAllProjects = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    technology,
    sort = "newest",
  } = queryParams;

  const query = {};

  // Search by title
  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  // Filter by technology
  if (technology) {
    query.technologies = technology;
  }

  let sortOption = {};

  switch (sort) {
    case "oldest":
      sortOption = { createdAt: 1 };
      break;

    case "title":
      sortOption = { title: 1 };
      break;

    default:
      sortOption = { createdAt: -1 };
  }

  const totalProjects = await Project.countDocuments(query);

  const projects = await Project.find(query)
    .populate("owner", "name email")
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return {
    projects,
    pagination: {
      total: totalProjects,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalProjects / limit),
    },
  };
};

// Get Single Project
export const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId).populate(
    "owner",
    "name email role"
  );

  if (!project) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Project not found"
    );
  }

  return project;
};

// Get Logged-in User Projects
export const getMyProjects = async (ownerId) => {
  return await Project.find({ owner: ownerId })
    .populate("owner", "name email role")
    .sort({ createdAt: -1 });
};

// Update Project
export const updateProject = async (
  projectId,
  ownerId,
  updateData
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Project not found"
    );
  }

  // Ownership check
  if (project.owner.toString() !== ownerId.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can update only your own projects"
    );
  }

  Object.assign(project, updateData);

  await project.save();

  return await project.populate("owner", "name email role");
};

// Delete Project
export const deleteProject = async (
  projectId,
  ownerId
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Project not found"
    );
  }

  // Ownership check
  if (project.owner.toString() !== ownerId.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can delete only your own projects"
    );
  }

  await project.deleteOne();

  return true;
};