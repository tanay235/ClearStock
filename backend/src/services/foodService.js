const listings = [];

function createListing(payload) {
  if (!payload?.aiResult?.isSafe) {
    const error = new Error("Food cannot be published unless AI marks it safe.");
    error.status = 400;
    throw error;
  }

  const listing = {
    id: payload.id || `food_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    foodName: payload.foodName,
    quantity: Number(payload.quantity),
    foodType: payload.foodType,
    preparedAt: payload.preparedAt,
    location: payload.location,
    notes: payload.notes || "",
    imageName: payload.imageName || "",
    aiResult: payload.aiResult,
    status: "Available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  listings.unshift(listing);
  return listing;
}

function listListings() {
  return listings;
}

function getListingById(id) {
  return listings.find(item => item.id === id) || null;
}

module.exports = {
  createListing,
  listListings,
  getListingById,
};
