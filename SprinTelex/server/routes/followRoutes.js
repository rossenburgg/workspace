const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/User');
const router = express.Router();

// Follow a user
router.post('/follow', authenticateToken, async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: userId } });
    await User.findByIdAndUpdate(userId, { $addToSet: { following: targetUserId } });
    console.log(`User ${userId} followed user ${targetUserId}`);
    res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following user:', error.message, error.stack);
    res.status(500).json({ message: 'Error following user', error: error.message });
  }
});

// Unfollow a user
router.post('/unfollow', authenticateToken, async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } });
    console.log(`User ${userId} unfollowed user ${targetUserId}`);
    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error.message, error.stack);
    res.status(500).json({ message: 'Error unfollowing user', error: error.message });
  }
});

module.exports = router;