import Notification from "../models/Notification.js";

/**
 * Create a notification — silently skip if sender is the recipient (no self-notifs)
 */
export const createNotification = async ({ recipient, sender, type, project, message = "" }) => {
  // Don't notify yourself
  if (recipient.toString() === sender.toString()) return;

  await Notification.create({ recipient, sender, type, project, message });
};

/**
 * Get all notifications for a user, newest first, with sender + project populated
 */
export const getUserNotifications = async (userId) => {
  return Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("sender", "name avatar")
    .populate("project", "title");
};

/**
 * Mark a single notification as read
 */
export const markOneRead = async (notifId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notifId, recipient: userId },
    { read: true },
    { new: true }
  );
};

/**
 * Mark all notifications for a user as read
 */
export const markAllRead = async (userId) => {
  await Notification.updateMany({ recipient: userId, read: false }, { read: true });
};

/**
 * Count unread notifications for a user
 */
export const countUnread = async (userId) => {
  return Notification.countDocuments({ recipient: userId, read: false });
};

/**
 * Delete a single notification
 */
export const deleteOneNotification = async (notifId, userId) => {
  await Notification.findOneAndDelete({ _id: notifId, recipient: userId });
};
