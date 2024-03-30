require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Added for profile updates
const reelsRoutes = require('./routes/reelsRoutes'); // Importing reels routes
const followRoutes = require('./routes/followRoutes'); // Importing follow routes
const searchRoutes = require('./routes/searchRoutes'); // Importing search routes
const reelInteractionRoutes = require('./routes/reelInteractionRoutes'); // Importing reel interaction routes
const authenticateToken = require('./middleware/authenticateToken');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(`Error connecting to MongoDB: ${err.message}`, err));

// Apply the authenticateToken middleware globally except for paths that start with '/api/auth'
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth')) {
    return next();
  }
  return authenticateToken(req, res, next);
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); // Use profile routes for profile-related operations
app.use('/api/reels', reelsRoutes); // Use reels routes for video-related operations
app.use('/api/follow', followRoutes); // Use follow routes for follow-related operations
app.use('/api/users/search', searchRoutes); // Use search routes for user search operations
app.use('/api/reels/interact', reelInteractionRoutes); // Use reel interaction routes for like, comment, share operations

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});