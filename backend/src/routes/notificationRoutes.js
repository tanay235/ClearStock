const express = require('express');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.get('/', protect, getUserNotifications);
router.patch('/:id/read', protect, markAsRead);

module.exports = router;
