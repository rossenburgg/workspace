const User = require('../models/User');

const userExistsMiddleware = async (req, res, next) => {
  const { email, username } = req.body;
  try {
    // Check for existing user in MongoDB by email or username
    const existingMongoUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingMongoUser) {
      console.log('User already exists with provided email or username in MongoDB:', email, username);
      return res.status(409).send({ message: 'User already exists with provided email or username' });
    }

    next();
  } catch (error) {
    console.error('Error checking if user exists:', error);
    console.error('Error details:', error.message);
    res.status(500).send({ message: 'Failed to check if user exists', error: error.message });
  }
};

module.exports = userExistsMiddleware;