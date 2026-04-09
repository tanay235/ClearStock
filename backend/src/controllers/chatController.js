const mongoose = require('mongoose');
const Message = require('../models/Message');
const Request = require('../models/Request');

/**
 * @desc    Send a new message
 * @route   POST /api/chat/send
 * @access  Private
 */
exports.sendMessage = async (req, res) => {
  try {
    const { requestId, receiverId, text } = req.body;
    const senderId = req.user.id;

    // Validate ObjectIds to prevent Casting errors
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid Request ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ success: false, message: 'Invalid Receiver ID format' });
    }

    // Check if the request exists
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found in database' });
    }

    // Explicit permission logging for debugging
    console.log(`[ChatDebug] Sender: ${senderId}, Buyer: ${request.buyerId}, Seller: ${request.sellerId}`);

    const isAuthorized = 
      request.buyerId.toString() === senderId || 
      request.sellerId.toString() === senderId;

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Authorization denied: You are not part of this request' });
    }

    const message = await Message.create({
      requestId,
      senderId,
      receiverId,
      text,
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error(`[ChatError] ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all messages for a specific request
 * @route   GET /api/chat/:requestId
 * @access  Private
 */
exports.getMessages = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ success: false, message: 'Invalid Request ID format' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request context not found' });
    }

    const isAuthorized = 
      request.buyerId.toString() === userId || 
      request.sellerId.toString() === userId;

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Authorization denied: Access to this conversation is restricted' });
    }

    const messages = await Message.find({ requestId })
      .populate('senderId', 'firstName lastName organizationName role')
      .sort({ createdAt: 1 });

    // Mark messages as read if the receiver is the current user
    await Message.updateMany(
      { requestId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(`[ChatError] ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
