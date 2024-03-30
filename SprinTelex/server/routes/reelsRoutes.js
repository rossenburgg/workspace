// Path: server/routes/reelsRoutes.js

const express = require('express');
const Reel = require('../models/Reel');
const User = require('../models/User'); // Ensure User model is imported if needed for populating uploader details
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const reels = await Reel.find({})
      .populate('uploader', 'username profilePictureUrl') // Assuming 'User' model has 'username' and 'profilePictureUrl'
      .exec();

    // Assuming we don't have a 'likes' field as per the feedback. Removing the likedByUser logic.
    res.json({ reels });
  } catch (error) {
    console.error('Error fetching reels feed:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching reels feed', error: error.message });
  }
});

module.exports = router;