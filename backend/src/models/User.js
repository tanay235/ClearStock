const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't return password in queries by default
    },
    organizationName: {
      type: String,
      trim: true,
      required: function() {
        return this.role === 'seller';
      }
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['seller', 'customer', 'admin'],
      required: [true, 'Role is required'],
    },
    profileImage: {
      type: String,
      description: 'URL to profile picture',
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        description: '[longitude, latitude]',
      }
    },
    notificationPreferences: {
      radiusKm: {
        type: Number,
        default: 15,
        description: 'Notify if new listing is within this radius',
      },
      pushEnabled: {
        type: Boolean,
        default: true,
      },
      emailEnabled: {
        type: Boolean,
        default: true,
      }
    },
    deviceToken: {
      type: String,
      description: 'For push notifications (e.g., FCM token)',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save password hashing hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token method
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Indexes
userSchema.index({ location: '2dsphere' }); // Allows sorting by distance

module.exports = mongoose.model('User', userSchema);
