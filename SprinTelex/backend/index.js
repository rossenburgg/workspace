const express = require('express');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes'); // Import the settingsRoutes
const authMiddleware = require('./middleware/authMiddleware');
const connectDB = require('./db');
const cron = require('node-cron'); // Added for scheduling sync task
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');

    // Simple route for testing the server
    app.get('/', (req, res) => {
      res.send('Hello World');
    });

    // Auth Routes
    app.use('/api/auth', authRoutes);

    // Message Routes
    app.use('/api/messages', messageRoutes);

    // Media Routes
    app.use('/api', mediaRoutes);

    // Notification Routes
    app.use('/api/notifications', notificationRoutes);

    // User Routes
    app.use('/api', userRoutes);

    // Settings Routes
    app.use('/api/settings', settingsRoutes); // Use the settingsRoutes

    // Example of using the authentication middleware
    // app.use('/api/protected', authMiddleware);  

    // Listen on port 3000
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB and start server:', error);
    console.error('Server initialization failed: ' + error.message);
  }
};

startServer();

app.use((err, req, res, next) => {
  console.error('Unhandled application error:', err.stack);
  res.status(500).send('Something broke!');
});