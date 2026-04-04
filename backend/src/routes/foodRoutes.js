const express = require("express");
const {
  createFoodListing,
  getFoodListings,
  getFoodListingById,
} = require("../controllers/foodController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getFoodListings);
router.get("/:id", getFoodListingById);

// Protected routes (Only Sellers can create)
router.post("/", protect, authorize("seller"), createFoodListing);

module.exports = router;
