import express from "express";

import {
  create,
  getAll,
  update,
  remove,
} from "../controllers/commentController.js";

import {
  createCommentValidation,
  updateCommentValidation,
} from "../validations/commentValidation.js";

import authenticate from "../middlewares/authenticate.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

// Get comments for a project
router.get(
  "/project/:projectId",
  getAll
);

// Create comment
router.post(
  "/project/:projectId",
  authenticate,
  createCommentValidation,
  validate,
  create
);

// Update comment
router.put(
  "/:id",
  authenticate,
  updateCommentValidation,
  validate,
  update
);

// Delete comment
router.delete(
  "/:id",
  authenticate,
  remove
);

export default router;