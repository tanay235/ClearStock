const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      description: 'The user (consumer or seller) receiving the notification',
    },
    type: {
      type: String,
      enum: ['new_listing', 'order_update', 'system_alert'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedInventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
    },
    actionUrl: {
      type: String,
      description: 'Deep link or URL to redirect on click',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
