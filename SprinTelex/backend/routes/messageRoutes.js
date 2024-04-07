const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// Middleware to authenticate
router.use(authMiddleware);

// Send a message
router.post('/chats/:chatId/messages', async (req, res) => {
  const { chatId } = req.params;
  const { content, receiverId } = req.body;
  const sendermongodbId = req.user.uid;

  try {
    const sender = await User.findOne({ mongodbId: sendermongodbId });
    const receiver = await User.findOne({ mongodbId: receiverId });

    if (!sender || !receiver) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Check if both users are mutual followers
    if (!sender.following.includes(receiver._id) || !receiver.followers.includes(sender._id)) {
      return res.status(403).send({ message: 'Users must be mutual followers to message each other' });
    }

    const newMessage = new Message({
      chatId,
      content,
      senderId: sender._id,
      receiverId: receiver._id
    });

    await newMessage.save();
    res.status(201).send(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    console.error(error.stack);
    res.status(500).send(error.message);
  }
});

// Fetch messages between two users
router.get('/chats/:chatId/messages', async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).sort('createdAt');
    res.status(200).send(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    console.error(error.stack);
    res.status(500).send(error.message);
  }
});

// Delete a message
router.delete('/delete-message/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      console.log(`Message with id ${id} not found`);
      return res.status(404).send('Message not found');
    }
    console.log(`Message with id ${id} deleted successfully`);
    res.status(200).send(`Message with id ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting message:', error);
    console.error(error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;
