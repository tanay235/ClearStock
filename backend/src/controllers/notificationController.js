const Notification = require('../models/Notification');

/**
 * Get all notifications for the authenticated user.
 */
async function getUserNotifications(req, res, next) {
  try {
    // Secured: Using the user ID directly from the decoded JWT token
    const userId = req.user.id; 

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json(notifications);
  } catch (error) {
    return next(error);
  }
}

/**
 * Mark a specific notification as read.
 */
async function markAsRead(req, res, next) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json(notification);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUserNotifications,
  markAsRead,
};
