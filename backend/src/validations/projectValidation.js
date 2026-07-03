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
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("Live Demo URL must be valid"),
];

// For updates, all fields are optional — only validate what is sent
export const updateProjectValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project description cannot be empty"),

  body("technologies")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one technology is required"),

  body("githubUrl")
    .optional()
    .isURL()
    .withMessage("Valid GitHub URL is required"),

  body("liveDemoUrl")
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("Live Demo URL must be valid"),
];