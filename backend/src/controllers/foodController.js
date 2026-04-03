const {
  createListing,
  listListings,
  getListingById,
} = require("../services/foodService");

function createFoodListing(req, res, next) {
  try {
    const { foodName, quantity, foodType, preparedAt, location, aiResult } = req.body || {};

    if (!foodName || !quantity || !foodType || !preparedAt || !location) {
      return res.status(400).json({
        message: "foodName, quantity, foodType, preparedAt and location are required.",
      });
    }

    if (!aiResult || aiResult.isSafe !== true) {
      return res.status(400).json({
        message: "Publish blocked: AI result must be safe.",
      });
    }

    const listing = createListing(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    return next(error);
  }
}

function getFoodListings(_req, res) {
  return res.status(200).json(listListings());
}

function getFoodListingById(req, res) {
  const listing = getListingById(req.params.id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found." });
  }
  return res.status(200).json(listing);
}

module.exports = {
  createFoodListing,
  getFoodListings,
  getFoodListingById,
};
