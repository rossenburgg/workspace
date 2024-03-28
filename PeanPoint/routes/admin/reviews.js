const express = require('express');
const router = express.Router();
const verifyToken = require('../../src/middleware/authMiddleware');
const Court = require('../../models/courtModel'); // Assuming the Court model includes reviews

// New route for fetching pending reviews
router.get('/pending-reviews', verifyToken, async (req, res) => {
  try {
    const courtsWithPendingReviews = await Court.find({
      'reviews.isApproved': false
    }, {
      'reviews.$': 1 // This will return only the first matching subdocument in the reviews array. Adjust according to your needs.
    });

    const pendingReviews = courtsWithPendingReviews.map(court => {
      // Assuming each court can have multiple reviews, you might want to flatten this according to your needs.
      return {
        courtId: court._id,
        reviews: court.reviews.filter(review => !review.isApproved)
      };
    });

    res.json(pendingReviews);
  } catch (error) {
    console.error('Error fetching pending reviews:', error.message, error.stack);
    res.status(500).send({ message: 'Error fetching pending reviews', error: error.message });
  }
});

// API endpoint for approving or declining a review
router.put('/review/:reviewId/approval', verifyToken, async (req, res) => {
  const { reviewId } = req.params;
  const { isApproved } = req.body;

  try {
    // Find the court containing the review
    const courtContainingReview = await Court.findOne({ "reviews._id": reviewId });

    if (!courtContainingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Find and update the review's approval status
    const reviewToUpdate = courtContainingReview.reviews.id(reviewId);
    reviewToUpdate.isApproved = isApproved;

    // Save the updated court document
    await courtContainingReview.save();

    res.json({ message: "Review approval status updated", review: reviewToUpdate });
  } catch (error) {
    console.error(`Error updating review ${reviewId} status:`, error.message, error.stack);
    res.status(500).send({ message: 'Error updating review status', error: error.message });
  }
});

module.exports = router;