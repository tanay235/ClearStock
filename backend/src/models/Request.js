const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request must belong to a buyer'],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request must reference a seller'],
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: [true, 'Request must reference an inventory item'],
    },
    quantityRequested: {
      type: Number,
      required: [true, 'Quantity requested is required'],
      min: 1,
    },
    unit: {
      type: String,
      default: 'units',
      description: 'e.g., units, cartons, etc',
    },
    expectedPriceTotal: {
      type: Number,
      required: [true, 'Total amount expected at fixed price is required'],
    },
    pickupDeliveryTime: {
      type: String,
      description: 'e.g., 5:00 PM Today',
    },
    note: {
      type: String,
      description: 'Offer / Note from the buyer',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Sold', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
requestSchema.index({ buyerId: 1 });
requestSchema.index({ sellerId: 1 });
requestSchema.index({ inventoryId: 1 });
requestSchema.index({ status: 1 });

module.exports = mongoose.model('Request', requestSchema);
