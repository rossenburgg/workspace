const express = require('express');
const { expressjwt: jwtMiddleware } = require('express-jwt');
require('dotenv').config({ path: './config/.env.local' });
const User = require('../models/user');
const router = express.Router();

// Middleware to protect routes
const requireAuth = jwtMiddleware({ 
  secret: process.env.JWT_SECRET, 
  algorithms: ['HS256'],
  requestProperty: 'auth'
});

// Fetch friends' locations
router.get('/locations', requireAuth, async (req, res) => {
  try {
    const userId = req.auth._id;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found.');
      return res.status(404).json({ message: 'User not found.' });
    }
    // Assuming User model has a friends field that is an array of ObjectIds referencing User
    const friends = await User.find({ '_id': { $in: user.friends } }).select('location name -_id');
    console.log('Friends locations fetched successfully.');
    res.status(200).json(friends);
  } catch (error) {
    console.error('Error fetching friends locations:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch friends locations', error: error.message });
  }
});

module.exports = router;