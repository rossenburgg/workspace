const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log('Authorization header is missing');
      return res.status(401).send('Authorization header is required');
    }
    const token = req.headers.authorization.split('Bearer ')[1];
    if (!token) {
      console.log('No token provided');
      return res.status(403).send('A token is required for authentication');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('User not found with ID from token');
        return res.status(404).send('User not found');
      }
      req.user = user;
      console.log('User authenticated with ID:', user.id);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      console.error(jwtError.message);
      console.error(jwtError.stack);
      return res.status(401).send('Invalid or expired token');
    }
    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    console.error('Error details:', error.message);
    console.error(error.stack);
    return res.status(401).send('Unauthorized');
  }
};

module.exports = authMiddleware;