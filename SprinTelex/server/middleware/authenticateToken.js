const jwt = require('jsonwebtoken');

// Middleware to authenticate and attach user to request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    console.log('No token provided, unauthorized access attempt.');
    return res.sendStatus(401); // No token, unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error verifying JWT token:', err);
      console.error('Error details:', err.message, err.stack);
      return res.sendStatus(403); // Token is not valid
    }
    req.user = user; // Attach the user to the request
    console.log('JWT token verified successfully, user authenticated.');
    next();
  });
};

module.exports = authenticateToken;