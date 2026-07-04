import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import HTTP_STATUS from "../constants/httpStatus.js";

import {
  getUserNotifications,
  markOneRead,
  markAllRead,
  countUnread,
  deleteOneNotification,
} from "../services/notificationService.js";

// GET /api/notifications — fetch all for logged-in user
export const getAll = asyncHandler(async (req, res) => {
  const notifications = await getUserNotifications(req.user._id);
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Notifications fetched", notifications)
  );
});

// GET /api/notifications/unread-count
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await countUnread(req.user._id);
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Unread count fetched", { count })
  );
});

// PATCH /api/notifications/:id/read — mark one as read
export const readOne = asyncHandler(async (req, res) => {
  const notif = await markOneRead(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Notification marked as read", notif)
  );
});

// PATCH /api/notifications/read-all — mark all as read
export const readAll = asyncHandler(async (req, res) => {
  await markAllRead(req.user._id);
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "All notifications marked as read", null)
  );
});

// DELETE /api/notifications/:id — delete one
export const deleteOne = asyncHandler(async (req, res) => {
  await deleteOneNotification(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Notification deleted", null)
  );
});
