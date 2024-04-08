// backend/routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Signup route with validation
router.post('/signup', [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('username').not().isEmpty().withMessage('Username is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, username, profilePictureUrl, location, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({ message: 'Email or username already in use' });
    }

    // Hash password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      profilePictureUrl,
      location,
      bio,
    });

    console.log(`User created successfully in MongoDB with ID: ${newUser._id}`);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`JWT token generated for user: ${newUser._id}`);

    // Send a response back to the frontend with the newly created user object and JWT token
    res.status(201).send({ user: newUser, token, message: 'User created successfully' });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`, error);
    console.error(error.stack);
    res.status(500).send({ message: 'Error creating user', error: error.message });
  }
});

// Signin route with validation
router.post('/signin', [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').not().isEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found during sign-in attempt:', email);
      return res.status(404).send({ message: 'User not found' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials provided for email:', email);
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`User signed in successfully: ${user._id}`);

    res.status(200).send({ token, message: 'User signed in successfully', userId: user._id.toString() });
  } catch (error) {
    console.error(`Error signing in user: ${error.message}`, error);
    console.error(error.stack);
    res.status(500).send({ message: 'Error signing in user', error: error.message });
  }
});

module.exports = router;