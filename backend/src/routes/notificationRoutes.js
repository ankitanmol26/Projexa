import express from "express";
import authenticate from "../middlewares/authenticate.js";
import {
  getAll,
  getUnreadCount,
  readOne,
  readAll,
  deleteOne,
} from "../controllers/notificationController.js";

const router = express.Router();

// All notification routes are protected
router.use(authenticate);

router.get("/", getAll);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", readAll);
router.patch("/:id/read", readOne);
router.delete("/:id", deleteOne);

export default router;
