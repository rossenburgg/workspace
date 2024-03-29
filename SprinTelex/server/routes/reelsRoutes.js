const express = require('express');
const multer = require('multer');
const router = express.Router();
const Reel = require('../models/Reel');
const authenticateToken = require('../middleware/authenticateToken');

// Set up multer for storing uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/reels'); // Specify the directory where uploaded videos should be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

router.post('/upload', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('No video file was uploaded.');
      return res.status(400).send('No video file uploaded.');
    }

    const reel = new Reel({
      videoUrl: req.file.path, // Assuming Reel model has a videoUrl field
      caption: req.body.caption,
      uploader: req.user.id // Assuming req.user.id is available from authenticateToken middleware
    });

    await reel.save();
    console.log('Video uploaded successfully:', reel);
    res.status(201).json({ message: 'Video uploaded successfully', reelId: reel._id });
  } catch (error) {
    console.error('Error uploading video:', error.message, error.stack);
    res.status(500).json({ message: 'Error uploading video', error: "An error occurred while uploading the video. Please try again later." });
  }
});

// Adding GET route for fetching reels
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reels = await Reel.find({}).populate('uploader', 'username profilePictureUrl'); // Fetch all reels from the database and populate uploader details
    if (!reels || reels.length === 0) {
      console.log('No reels found');
      return res.status(404).json({ message: 'No reels found' });
    }
    console.log('Fetched reels successfully');
    res.status(200).json({ videos: reels });
  } catch (error) {
    console.error('Error fetching reels:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching reels', error: "An error occurred while fetching the reels. Please try again later." });
  }
});

module.exports = router;