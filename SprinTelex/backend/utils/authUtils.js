const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    console.error(error.message);
    console.error(error.stack);
    throw error;
  }
};

// Function to compare a password with a hashed password
const comparePassword = async (candidatePassword, userPassword) => {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (error) {
    console.error('Error comparing password:', error);
    console.error(error.message);
    console.error(error.stack);
    throw error;
  }
};

// Function to generate a JWT token
const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    console.error(error.message);
    console.error(error.stack);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
};