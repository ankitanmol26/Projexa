import express from "express";

import {
  create,
  getAll,
  getOne,
} from "../controllers/projectController.js";

import { createProjectValidation } from "../validations/projectValidation.js";

import validate from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

const router = express.Router();

// Public Routes
router.get("/", getAll);
router.get("/:id", getOne);

// Student Only
router.post(
  "/",
  authenticate,
  authorize(ROLES.STUDENT),
  createProjectValidation,
  validate,
  create
);

export default router;