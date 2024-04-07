const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Chat' // Assuming a Chat model exists that represents a conversation between two users
  },
  content: {
    type: String,
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

messageSchema.pre('save', async function (next) {
  try {
    console.log(`Attempting to save message from senderId: ${this.senderId} to receiverId: ${this.receiverId}`);
    next();
  } catch (error) {
    console.error(`Error saving message: ${error.message}`, error);
    next(error);
  }
});

module.exports = mongoose.model('Message', messageSchema);