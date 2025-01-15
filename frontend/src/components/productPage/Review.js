import React, { useState, useEffect, useContext } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

function Review({
  productId,
  setReviewCount,
  updateReviewCounts,
  onReviewChange,
}) {
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [rating, setRating] = useState(0); // State for new review rating
  const [hover, setHover] = useState(undefined); // State for star hover effect
  const [feedback, setFeedback] = useState(""); // State for new review feedback
  const [customerName, setCustomerName] = useState(""); // State for customer name
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [modifyMode, setModifyMode] = useState(false);
  const { token } = useContext(AuthContext);

  // Fetch existing reviews on component load
  useEffect(() => {
    axios
      .get(`http://localhost:1000/api/reviews/${productId}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [productId]);

  // Toggle the review box
  const toggleReviewBox = () => {
    setShowReviewBox((prev) => !prev);
  };

  const toggleModifyMode = () => setModifyMode((prev) => !prev);

  // Handle star rating selection
  const handleClick = (value) => setRating(value);

  // Handle star hover
  const handleMouseEnter = (value) => setHover(value);
  const handleMouseLeave = () => setHover(undefined);

  // Handle feedback and name input changes
  const handleFeedbackChange = (e) => setFeedback(e.target.value);
  const handleNameChange = (e) => setCustomerName(e.target.value);

  // Submit a new review
  const handleSubmit = () => {
    if (!token) {
      alert("Please sign in to submit a review.");
      return;
    }

    const validationError = validateReview(feedback);
    if (validationError) {
      alert(validationError);
      return;
    }

    if (!customerName.trim() || rating === 0 || !feedback.trim()) {
      alert("Please complete all fields before submitting.");
      return;
    }

    const newReview = {
      productId,
      customerName,
      customerRating: rating,
      review: feedback,
    };

    axios
      .post("http://localhost:1000/api/reviews", newReview)
      .then((response) => {
        setReviews((prev) => [...prev, response.data]);
        onReviewChange();
        if (setReviewCount) setReviewCount((prev) => prev + 1);
        if (updateReviewCounts) updateReviewCounts(productId);
        setCustomerName("");
        setRating(0);
        setFeedback("");
        setShowReviewBox(false);
      })
      .catch((error) => {
        console.error("Error saving review:", error.response || error.message);
        alert("Failed to submit review. Please try again.");
      });
  };

  // Edit an existing review
  const handleEdit = (review) => {
    setEditingReview(review._id);
    setCustomerName(review.customerName);
    setRating(review.customerRating);
    setFeedback(review.review);
  };

  const handleUpdate = () => {
    if (!token) {
      alert("Please sign in to edit a review.");
      return;
    }

    const validationError = validateReview(feedback);
    if (validationError) {
      alert(validationError);
      return;
    }

    const updatedReview = {
      customerName,
      customerRating: rating,
      review: feedback,
    };

    axios
      .patch(
        `http://localhost:1000/api/reviews/${editingReview}`,
        updatedReview,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setReviews((prev) =>
          prev.map((review) =>
            review._id === editingReview
              ? { ...review, ...updatedReview }
              : review
          )
        );
        onReviewChange();
        setEditingReview(null);
        setCustomerName("");
        setRating(0);
        setFeedback("");
      })
      .catch((error) => {
        console.error(
          "Error updating review:",
          error.response || error.message
        );
        alert("Failed to update review. Please try again.");
      });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setCustomerName("");
    setRating(0);
    setFeedback("");
  };

  const validateReview = (feedback) => {
    const bannedWords = ["fuck", "motherfucker", "dick"]; // Add more as needed

    // Check for banned words
    for (const word of bannedWords) {
      if (feedback.toLowerCase().includes(word)) {
        return `Your review contains inappropriate content: "${word}" is not allowed.`;
      }
    }
    return ""; // No validation errors
  };

  // Delete an existing review
  const handleDelete = (id) => {
    if (!token) {
      alert("Please sign in to delete a review.");
      return;
    }

    axios
      .delete(`http://localhost:1000/api/reviews/${id}`)
      .then(() => {
        setReviewCount((prev) => Math.max(prev - 1, 0));
        setReviews((prev) => prev.filter((review) => review._id !== id));
        onReviewChange();
      })
      .catch((error) => console.error("Error deleting review:", error));
  };

  return (
    <div className="container">
      {token && (
        <button onClick={toggleReviewBox}>
          {showReviewBox ? "Cancel" : "Leave a Review"}
        </button>
      )}

      {token && showReviewBox && (
        <>
          <h2>Leave a Review</h2>
          <p className="review-guidelines">
            <strong>Review Guidelines:</strong> Please avoid hate speech, spam,
            or inappropriate content.
          </p>
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <div className="stars">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <FaStar
                  key={index}
                  size={24}
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHover(index + 1)}
                  onMouseLeave={() => setHover(undefined)}
                  color={
                    (hover || rating) >= index + 1 ? colors.orange : colors.grey
                  }
                />
              ))}
          </div>
          <textarea
            placeholder="Your Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}

      {token && (
        <button onClick={toggleModifyMode}>
          {modifyMode ? "Done" : "Modify Reviews"}
        </button>
      )}

      <h3>Reviews</h3>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              {editingReview === review._id ? (
                <>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                  />
                  <div className="stars">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <FaStar
                          key={index}
                          size={24}
                          onClick={() => setRating(index + 1)}
                          onMouseEnter={() => setHover(index + 1)}
                          onMouseLeave={() => setHover(undefined)}
                          color={
                            (hover || rating) >= index + 1
                              ? colors.orange
                              : colors.grey
                          }
                        />
                      ))}
                  </div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Your Feedback"
                  />
                  <button onClick={handleUpdate}>Update</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <p>
                    <strong>{review.customerName}</strong> rated:{" "}
                    <span className="stars-display">
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <FaStar
                            key={index}
                            size={20}
                            color={
                              index < review.customerRating
                                ? colors.orange
                                : colors.grey
                            }
                          />
                        ))}
                    </span>
                  </p>
                  <p>{review.review}</p>
                  {token && modifyMode && (
                    <>
                      <button onClick={() => handleEdit(review)}>Edit</button>
                      <button onClick={() => handleDelete(review._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews for this product.</p>
      )}
    </div>
  );
}

export default Review;
