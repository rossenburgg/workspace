const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/')); // Ensure the uploads directory exists
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST endpoint for file upload
router.post('/upload-media', upload.single('media'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.log('No file uploaded.');
      return res.status(400).send('No file uploaded.');
    }
    console.log(`File uploaded successfully: ${file.filename}`);
    // Assuming the server is configured to serve static files from /public
    res.status(201).send({
      message: 'File uploaded successfully',
      filePath: `/uploads/${file.filename}` // The path is now correctly set assuming static files are served from the 'public' directory
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router;