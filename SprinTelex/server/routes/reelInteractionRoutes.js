const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const Reel = require('../models/Reel'); // Assuming this model exists and is properly set up
const router = express.Router();

// Like a reel
router.post('/like', authenticateToken, async (req, res) => {
  const { reelId } = req.body;
  const userId = req.user.id;

  try {
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    // Toggle like status
    const index = reel.likes.indexOf(userId);
    if (index > -1) {
      reel.likes.splice(index, 1); // Unlike
    } else {
      reel.likes.push(userId); // Like
    }

    await reel.save();
    res.status(200).json({ message: 'Reel interaction updated', likesCount: reel.likes.length });
    console.log(`User ${userId} updated like status for reel ${reelId}`);
  } catch (error) {
    console.error('Error updating reel interaction:', error.message, error.stack);
    res.status(500).json({ message: 'Error updating reel interaction', error: error.message });
  }
});

module.exports = router;