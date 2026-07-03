import { body } from "express-validator";

export const createProjectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required"),

  body("technologies")
    .isArray({ min: 1 })
    .withMessage("At least one technology is required"),

  body("githubUrl")
    .isURL()
    .withMessage("Valid GitHub URL is required"),

  body("liveDemoUrl")
    .optional()
    .isURL()
    .withMessage("Live Demo URL must be valid"),
];