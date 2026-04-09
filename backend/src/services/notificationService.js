const nodemailer = require('nodemailer');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * Basic Nodemailer transporter.
 * NOTE: For hackathon development, use a trap like Mailtrap.io or Ethereal.email.
 * In a real-world scenario, use an AWS SES or SendGrid transporter.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'sample_user',
    pass: process.env.SMTP_PASS || 'sample_pass',
  },
});

/**
 * Finds nearby buyers based on the listing's location and their preferred radius.
 * Sends both in-app and email notifications.
 */
async function notifyNearbyUsers(listing) {
  try {
    if (!listing.location || !listing.location.coordinates) {
      console.warn(`[Notification] Listing ${listing._id} has no location coordinates. Skipping notifications.`);
      return;
    }

    // Coordinates of the newly added listing
    const [listingLng, listingLat] = listing.location.coordinates;

    // Radius logic: Users has their own `radiusKm` in their notificationPreferences.
    // MongoDB's $near returns items in meters.
    // We find all 'buyer' role users within their respective radii.
    // However, to do this efficiently in one query:
    // We use $near with a maximum of e.g. 50km if the user's specific preferences can't be handled in the query easily.
    // For simplicity in a Hackathon, let's find all buyers within 50km and filter by their preferences in memory.
    
    const potentialUsers = await User.find({
      role: 'buyer',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [listingLng, listingLat],
          },
          $maxDistance: 50000, // 50km hard max for initial scan
        },
      },
      'notificationPreferences.pushEnabled': true,
    });

    const notifications = [];

    for (const user of potentialUsers) {
      // Calculate distance (if needed for filtering, but $near already filters by max distance)
      // Check if user has emailEnabled
      
      const title = `New Listing Nearby: ${listing.productName}`;
      const message = `A new listing for ${listing.productName} is available near you at only ₹${listing.listingPrice}! Item expires in ${Math.ceil((new Date(listing.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days.`;
      const actionUrl = `/listings/${listing._id}`;

      // 1. Create In-App Notification
      notifications.push({
        userId: user._id,
        type: 'new_listing',
        title,
        message,
        relatedInventoryId: listing._id,
        actionUrl,
      });

      // 2. Send Email if preferred
      if (user.notificationPreferences?.emailEnabled) {
        sendEmailNotification(user, title, message, actionUrl);
      }
    }

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`[Notification] Created ${notifications.length} notifications for listing ${listing._id}`);
    }

  } catch (error) {
    console.error('[Notification Error]', error);
  }
}

/**
 * Sends a basic HTML email to the user.
 */
async function sendEmailNotification(user, title, message, actionUrl) {
  const mailOptions = {
    from: '"ClearStock" <no-reply@clearstock.com>',
    to: user.email,
    subject: title,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #10b981;">ClearStock: New Deal Near You</h2>
        <p>Hello ${user.firstName},</p>
        <p>${message}</p>
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}${actionUrl}" 
           style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px;">
           View Deal
        </a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] Successful notification to ${user.email}`);
  } catch (error) {
    console.error(`[Email Error] Failed to send to ${user.email}:`, error.message);
  }
}

module.exports = {
  notifyNearbyUsers,
};
