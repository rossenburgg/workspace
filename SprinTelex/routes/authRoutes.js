const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Setup nodemailer configuration. Replace with your email config
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

router.post('/register', async (req, res) => {
  try {
    console.log('Attempting to register a new user');
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      console.log('User already exists');
      return res.status(409).send('A user with this email or username already exists.');
    }

    const newUser = new User({ username, email, password, emailVerified: false });
    await newUser.save();

    // Send verification email
    const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationUrl = `http://192.168.8.130:3000/api/auth/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email</p>`
    }).catch(error => {
      console.error('Error sending verification email:', error);
      return res.status(500).send('Failed to send verification email.');
    });

    console.log('User registered successfully. Verification email sent.');
    res.status(201).send('User registered successfully. Please check your email to verify your account.');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Attempting user login');
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid credentials');
      return res.status(401).send('Invalid credentials');
    }

    if (!user.emailVerified) {
      console.log('Email not verified');
      return res.status(403).send('Please verify your email before logging in.');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log('User logged in successfully');
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found.');
    }
    user.emailVerified = true;
    await user.save();
    console.log('Email verified successfully');
    res.send('Email verified successfully.');
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).send('Failed to verify email.');
  }
});

module.exports = router;