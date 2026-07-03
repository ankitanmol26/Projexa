import express from "express";

import { likeProject, getLikeStatus } from "../controllers/likeController.js";

import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Toggle Like
router.post("/:projectId", authenticate, likeProject);

// Get like status for current user
router.get("/:projectId/me", authenticate, getLikeStatus);

export default router;