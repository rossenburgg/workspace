const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();

// Middleware to authenticate and attach user to request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    console.log('No token provided, unauthorized access attempt.');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error verifying JWT token:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  const { username, email, password, profilePictureUrl } = req.body;
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      ...(username && { username }),
      ...(email && { email }),
      ...(hashedPassword && { password: hashedPassword }),
      ...(profilePictureUrl && { profilePictureUrl }),
    }, { new: true });

    if (!updatedUser) {
      console.log('User not found for update');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User profile updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
});

// Set up multer for storing uploaded files
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });

// Add a new route for updating the profile picture
router.put('/updateProfilePicture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Here you would implement the logic to save the file to a storage service and get its URL
  // For demonstration, let's assume the function saveProfilePicture does this and returns a URL
  try {
    const profilePictureUrl = await saveProfilePicture(req.file); // Implement this function based on your storage solution
    const user = await User.findByIdAndUpdate(req.user.id, { profilePictureUrl: profilePictureUrl }, { new: true });
    res.json({ message: 'Profile picture updated.', user });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).send('Error updating profile picture.');
  }
});

module.exports = router;