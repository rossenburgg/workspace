const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Court = require('./models/courtModel');
require('dotenv').config();
const winston = require('winston'); // Added for structured logging
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const reviewsAdminRouter = require('./routes/admin/reviews');
const courtsAdminRouter = require('./routes/admin/courts');
const User = require('./models/userModel'); // Assuming a userModel exists for handling user data

// Configure Winston for structured logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console(),
  ],
});

// MongoDB connection string is loaded from environment variables for security reasons
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB connected...'))
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    logger.error(err.stack);
  });

app.use(cors({origin: true})); // Enable CORS for all routes, allowing requests from all origins
app.use(express.json()); // Middleware to parse JSON bodies

// Enhanced Middleware to log the start and end of each request
app.use((req, res, next) => {
  const start = Date.now();
  logger.info(`[${new Date().toISOString()}] - Started ${req.method} ${req.path}`);
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[${new Date().toISOString()}] - Finished ${req.method} ${req.path} with status ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Unified login endpoint for both admin and normal users
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    logger.error(`Failed to authenticate user: ${error.message}`, { error: error.stack });
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Endpoint for user registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body; // Default role is 'user'
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(`Failed to register user: ${error.message}`, { error: error.stack });
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetches a list of nearby basketball courts based on supplied latitude and longitude query parameters
app.get('/api/courts', async (req, res) => {
  const { latitude, longitude } = req.query;
  logger.info(`Received request for /api/courts with latitude: ${latitude} and longitude: ${longitude}`);
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude query parameters are required.' });
  }
  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);
  if (isNaN(lat) || isNaN(long) || lat < -90 || lat > 90 || long < -180 || long > 180) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90, and longitude must be between -180 and 180.' });
  }
  try {
    logger.info(`Querying database for courts near latitude: ${latitude}, longitude: ${longitude}`);
    const courts = await Court.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000 // 5 kilometers
        }
      }
    });
    logger.info(`Courts fetched successfully: ${courts.length} courts found.`);
    res.json(courts);
  } catch (error) {
    logger.error(`Failed to fetch courts: ${error.message}`, { error: error.stack });
    res.status(500).json({ error: 'Failed to fetch courts due to a server error. Please try again later.' });
  }
});

// Fetches details of a specific basketball court by courtId
app.get('/api/courts/:courtId', async (req, res) => {
  try {
    const { courtId } = req.params;
    logger.info(`Querying database for court details with courtId: ${courtId}`);
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }
    logger.info(`Court details fetched successfully for courtId: ${courtId}`);
    res.json(court);
  } catch (error) {
    logger.error(`Failed to fetch court details for courtId: ${req.params.courtId}: ${error.message}`, { error: error.stack });
    res.status(500).json({ error: 'Failed to fetch court details due to a server error. Please try again later.' });
  }
});

// Use the new admin routes
app.use('/api/admin', reviewsAdminRouter);
app.use('/api/admin', courtsAdminRouter);

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error encountered: ${err.message}`, { error: err.stack });
  res.status(500).json({ error: 'Internal Server Error', details: err.stack });
});