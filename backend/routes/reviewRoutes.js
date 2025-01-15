const express = require("express");
const Review = require("../models/Review");
const router = express.Router();

// Validate review backend
const validateReviewBackend = (feedback) => {
  const bannedWords = ["fuck", "motherfucker", "dick"];

  for (const word of bannedWords) {
    if (feedback.toLowerCase().includes(word)) {
      return `Review contains inappropriate content: "${word}" is not allowed.`;
    }
  }

  return "";
};

// Fetch aggregated review counts and average ratings for all products
router.get("/counts", async (req, res) => {
  try {
    const reviewData = await Review.aggregate([
      {
        $group: {
          _id: "$productId",
          count: { $sum: 1 },
          avgRating: { $avg: "$customerRating" },
        },
      },
    ]);
    res.json(reviewData);
  } catch (error) {
    console.error("Error fetching review counts:", error);
    res.status(500).json({ error: "Failed to fetch review counts" });
  }
});

// Fetch all reviews for a specific product
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Add a new review
router.post("/", async (req, res) => {
  try {
    const { productId, customerName, customerRating, review } = req.body;

    if (!productId || !customerName || !customerRating || !review) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const validationError = validateReviewBackend(review);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newReview = new Review({
      productId,
      customerName,
      customerRating,
      review,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ error: "Failed to save review" });
  }
});

// Update an existing review
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, customerRating, review } = req.body;

    if (!customerName || !customerRating || !review) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const validationError = validateReviewBackend(review);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { customerName, customerRating, review },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
