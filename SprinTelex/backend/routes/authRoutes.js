const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config({ path: './.env.local' }); // Ensure the .env.local file is correctly placed in the backend directory

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists.');
      return res.status(400).json({ message: 'User already exists.' });
    }

    const user = await User.create({ email, password });
    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User registered successfully.');
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error registering user:', error.message, error.stack);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User doesn't exist.");
      return res.status(404).json({ message: "User doesn't exist." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('Invalid credentials.');
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User logged in successfully.');
    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error logging in user:', error.message, error.stack);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;