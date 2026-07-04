import express from "express";

import {
  create,
  getAll,
  getOne,
  getMine,
  update,
  remove,
} from "../controllers/projectController.js";

import {
  createProjectValidation,
  updateProjectValidation,
} from "../validations/projectValidation.js";

import validate from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const parseTechnologies = (req, res, next) => {
  if (req.body.technologies && typeof req.body.technologies === "string") {
    try {
      req.body.technologies = JSON.parse(req.body.technologies);
    } catch (err) {
      // Ignore, let express-validator catch it if invalid
    }
  }
  next();
};

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/", getAll);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Get logged-in user's projects
router.get(
  "/me",
  authenticate,
  getMine
);

// Create project
router.post(
  "/",
  authenticate,
  upload.array("gallery", 5),
  parseTechnologies,
  createProjectValidation,
  validate,
  create
);

// Update project
router.put(
  "/:id",
  authenticate,
  upload.array("gallery", 5),
  parseTechnologies,
  updateProjectValidation,
  validate,
  update
);

// Delete project
router.delete(
  "/:id",
  authenticate,
  remove
);

// Get project by ID
router.get("/:id", getOne);

export default router;