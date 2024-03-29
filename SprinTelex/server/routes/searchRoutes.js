const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Route for searching users by username
router.get('/', authenticateToken, async (req, res) => {
  const searchQuery = req.query.query;
  if (!searchQuery) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const users = await User.find({
      username: { $regex: searchQuery, $options: 'i' }, // Case-insensitive search
    }).select('-password'); // Exclude password from the results

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    console.log(`Found ${users.length} users matching the search query: ${searchQuery}`);
    res.json({ users });
  } catch (error) {
    console.error('Error searching for users:', error.message, error.stack);
    res.status(500).json({ message: 'Error searching for users', error: error.message });
  }
});

module.exports = router;