const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Message = require('../models/message');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const router = express.Router();

// Middleware to protect routes
const requireAuth = jwtMiddleware({ 
  secret: process.env.JWT_SECRET, 
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

// Send a message
router.post('/send', requireAuth, async (req, res) => {
  const { sender, receiver, content } = req.body;
  try {
    const message = await Message.create({ sender, receiver, content });
    console.log('Message sent successfully.');
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// Retrieve conversation between two users
router.get('/conversation/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate('sender receiver', 'email');
    console.log('Messages retrieved successfully.');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to retrieve messages', error: error.message });
  }
});

// Delete a message
router.delete('/delete/:messageId', requireAuth, async (req, res) => {
  const { messageId } = req.params;
  try {
    await Message.findByIdAndDelete(messageId);
    console.log('Message deleted successfully.');
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to delete message', error: error.message });
  }
});

module.exports = router;