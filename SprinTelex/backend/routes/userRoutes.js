const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming User model exists for MongoDB operations
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware
const mongoose = require('mongoose'); // Import mongoose to handle ObjectId for querying multiple users

// Add a new route for searching users by username
router.get('/search', authMiddleware, async (req, res) => {
  const { username } = req.query; // Extract the username search query from the request query parameters

  try {
    // Use a case-insensitive regex search to find users with usernames partially matching the search query
    const users = await User.find({
      username: { $regex: new RegExp(username, 'i') }
    }, 'username email profilePictureUrl -_id'); // Select specific fields to return and exclude sensitive information like _id

    // Return the array of matching user objects
    console.log(`Users found for search query "${username}":`, users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching for users:', error);
    console.error(error.message);
    res.status(500).send({ message: 'Error searching for users', error: error.message });
  }
});

// Follow a user
router.post('/follow/:userId', authMiddleware, async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user._id; // Adjusted to use MongoDB user ID

  if (targetUserId === currentUserId.toString()) {
    return res.status(400).send({ message: 'You cannot follow yourself' });
  }

  try {
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Prevent duplicate follows
    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUser._id);
    } else {
      return res.status(400).send({ message: 'You already follow this user' });
    }

    await currentUser.save();
    await targetUser.save();

    console.log(`User ${currentUserId} followed user ${targetUserId} successfully`);
    res.status(200).send({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    console.error(error.message);
    res.status(500).send({ message: 'Error following user', error: error.message });
  }
});

// Route to fetch multiple users by their IDs
router.get('/users/details', authMiddleware, async (req, res) => {
  const { userIds } = req.query;
  try {
    const ids = userIds.split(',').map(id => mongoose.Types.ObjectId(id));
    const users = await User.find({ '_id': { $in: ids } }, 'username email profilePictureUrl'); // Removed -_id from projection
    console.log(`Fetched details for users: ${userIds}`);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    console.error(error.message);
    res.status(500).send({ message: 'Error fetching users', error: error.message });
  }
});

// PATCH route for updating user profile
router.patch('/users/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { location, bio } = req.body;
  const currentUserId = req.user._id; // Adjusted to use MongoDB user ID

  try {
    const user = await User.findById(currentUserId);

    if (!user || user._id.toString() !== userId) {
      return res.status(403).send({ message: 'Unauthorized to update this profile' });
    }

    user.location = location;
    user.bio = bio;
    await user.save();

    console.log(`Profile updated successfully for user ${userId}`);
    res.status(200).json({ message: 'Profile updated successfully', user: { location: user.location, bio: user.bio } });
  } catch (error) {
    console.error('Error updating user profile:', error);
    console.error(error.message);
    res.status(500).send({ message: 'Error updating user profile', error: error.message });
  }
});

module.exports = router;