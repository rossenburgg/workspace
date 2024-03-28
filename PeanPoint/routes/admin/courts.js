const express = require('express');
const router = express.Router();
const verifyToken = require('../../src/middleware/authMiddleware'); // Adjusted the path for authMiddleware
const Court = require('../../models/courtModel'); // Assuming Court model exists and is imported here

// API endpoint for fetching pending court submissions
router.get('/pending-courts', verifyToken, async (req, res) => {
  try {
    const pendingCourts = await Court.find({ isApproved: false });
    console.log('Fetched pending courts successfully');
    res.json(pendingCourts);
  } catch (error) {
    console.error('Error fetching pending courts:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching pending courts', error: error.message });
  }
});

// API endpoint for approving or declining court submissions
router.put('/court/:id/approval', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  try {
    const court = await Court.findById(id);
    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }
    court.isApproved = isApproved; // Assuming 'isApproved' field exists in the Court model
    await court.save();

    console.log(`Court with ID: ${id} approval status updated successfully to: ${isApproved}`);
    res.json({ message: "Court approval status updated", court });
  } catch (error) {
    console.error(`Error updating court status for ID: ${id}:`, error.message, error.stack);
    res.status(500).json({ message: 'Error updating court status', error: error.message });
  }
});

module.exports = router;