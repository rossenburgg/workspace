const express = require('express');
const { expressjwt: jwtMiddleware } = require('express-jwt');
const multer = require('multer');
const Reel = require('../models/reel');
require('dotenv').config({ path: './config/.env.local' });
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const storage = multer.memoryStorage(); // Using memory storage for demonstration purposes
const upload = multer({ storage: storage });

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Middleware to protect routes
const requireAuth = jwtMiddleware({ 
  secret: process.env.JWT_SECRET, 
  algorithms: ['HS256'],
  requestProperty: 'auth' // This line specifies where to attach the decoded JWT payload
});

// Create a Reel
router.post('/create', requireAuth, async (req, res) => {
  const { videoUrl, description } = req.body;
  const creator = req.auth._id; // Ensure creator is assigned only if req.auth is truthy
  if (!creator) {
    console.log('Creator ID not found in request.');
    return res.status(400).json({ message: 'Creator ID is required.' });
  }
  try {
    const reel = await Reel.create({ creator, videoUrl, description });
    console.log('Reel created successfully.');
    res.status(201).json(reel);
  } catch (error) {
    console.error('Error creating reel:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to create reel', error: error.message });
  }
});

// Fetch all Reels
router.get('/all', async (req, res) => {
  try {
    const reels = await Reel.find().populate('creator', 'email');
    console.log('Reels fetched successfully.');
    res.status(200).json(reels);
  } catch (error) {
    console.error('Error fetching reels:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch reels', error: error.message });
  }
});

// Like a Reel
router.post('/like/:reelId', requireAuth, async (req, res) => {
  const { reelId } = req.params;
  const userId = req.auth._id; // Ensure userId is assigned only if req.auth is truthy
  if (!userId) {
    console.log('User ID not found in request.');
    return res.status(400).json({ message: 'User ID is required to like a reel.' });
  }
  try {
    const updatedReel = await Reel.findByIdAndUpdate(reelId, { $addToSet: { likes: userId } }, { new: true });
    console.log('Reel liked successfully.');
    res.status(200).json(updatedReel);
  } catch (error) {
    console.error('Error liking reel:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to like reel', error: error.message });
  }
});

// Upload a Reel
router.post('/upload', requireAuth, upload.single('video'), async (req, res) => {
  const { description } = req.body;
  const creator = req.auth._id;
  if (!req.file) {
    console.log('No video file uploaded.');
    return res.status(400).json({ message: 'Video file is required.' });
  }
  const fileContent = Buffer.from(req.file.buffer, 'binary');
  const fileName = `reels/${uuidv4()}-${req.file.originalname}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, async (err, data) => {
    if (err) {
      console.error('Error uploading to S3:', err.message, err.stack);
      return res.status(500).json({ message: 'Failed to upload video', error: err.message });
    }
    try {
      const videoUrl = data.Location;
      const reel = await Reel.create({ creator, videoUrl, description });
      console.log('Reel uploaded successfully.');
      res.status(201).json(reel);
    } catch (error) {
      console.error('Error creating reel after upload:', error.message, error.stack);
      res.status(500).json({ message: 'Failed to create reel after upload', error: error.message });
    }
  });
});

module.exports = router;