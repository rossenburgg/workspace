const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const axios = require('axios'); // Ensure axios is imported for making HTTP requests

// POST endpoint to update user settings such as profile visibility and notification preferences
router.post('/update', authMiddleware, async (req, res) => {
  const { profileVisibility, notificationPreferences } = req.body;
  const userId = req.user._id; // Adjusted to use MongoDB user ID

  try {
    // Find user by MongoDB ID and update settings
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          profileVisibility: profileVisibility,
          notificationPreferences: notificationPreferences,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({
      message: 'Settings updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    console.error(error.message);
    res.status(500).send({ message: 'Failed to update settings', error: error.message });
  }
});

// New GET endpoint to retrieve current user's settings
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user._id; // Adjusted to use MongoDB user ID

  try {
    const userSettings = await User.findById(userId, 'profileVisibility notificationPreferences');
    if (!userSettings) {
      return res.status(404).send({ message: 'User settings not found' });
    }
    res.status(200).send(userSettings);
  } catch (error) {
    console.error('Error retrieving user settings:', error);
    console.error(error.message);
    res.status(500).send({ message: 'Failed to retrieve settings', error: error.message });
  }
});

module.exports = router;