const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log(`User verified with username: ${decoded.username}`);
      next();
    } else {
      console.log('Authorization header is missing');
      return res.status(403).json({ message: 'A token is required for authentication' });
    }
  } catch (error) {
    console.error(`Token verification failed: ${error.message}`, error.stack);
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;