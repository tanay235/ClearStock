const mongoose = require('mongoose');

const aiCheckSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
    },
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    suggestedExpiry: Date,
    suggestedPrice: Number,
    confidenceScore: Number,
    safetyStatus: String,
    rawAiResponse: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AICheck', aiCheckSchema);