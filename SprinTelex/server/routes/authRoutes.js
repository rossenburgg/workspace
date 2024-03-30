const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken'); // Ensure this middleware is imported

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with this email:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    console.log('User created successfully:', newUser);

    // Include the user's ID in the JWT token payload upon successful registration
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT token generated for user:', newUser._id);

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error registering user:', error.message, error.stack);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Include the user's ID in the JWT token payload upon successful login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('User logged in successfully:', user._id);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error.message, error.stack);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// New route to check if the user is authenticated
router.get('/check', authenticateToken, (req, res) => {
  // If the middleware does not block the request, it means the user is authenticated
  res.status(200).json({ isAuthenticated: true });
});

module.exports = router;