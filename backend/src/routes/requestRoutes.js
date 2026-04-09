const express = require('express');
const { 
  getBuyerRequests, 
  getSellerRequests, 
  updateRequestStatus,
  createRequest,
  getRequestById,
  cancelRequest
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All request routes are protected by JWT
router.use(protect);

// Buyer specific
router.get('/my-requests', authorize('buyer'), getBuyerRequests);
router.post('/', authorize('buyer'), createRequest);
router.delete('/:id', authorize('buyer'), cancelRequest);

// Seller specific
router.get('/incoming', authorize('seller'), getSellerRequests);

// Shared (Parameterized routes must be last!)
router.get('/:id', getRequestById);
router.patch('/:id/status', updateRequestStatus);

module.exports = router;
