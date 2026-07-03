import Project from "../models/Project.js";

export const createProject = async (projectData, ownerId) => {
  const project = await Project.create({
    ...projectData,
    owner: ownerId,
  });

  return project;
};

export const getAllProjects = async () => {
  return await Project.find()
    .populate("owner", "name email")
    .sort({ createdAt: -1 });
};

export const getProjectById = async (id) => {
  return await Project.findById(id).populate(
    "owner",
    "name email"
  );
};