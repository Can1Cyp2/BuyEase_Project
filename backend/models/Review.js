const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerRating: { type: Number, required: true },
  review: { type: String, required: true },
});

module.exports = mongoose.model("Review", reviewSchema);
