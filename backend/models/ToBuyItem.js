// backend/models/ToBuyItem.js
const mongoose = require("mongoose");

const toBuyItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to Product model
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.String,
    ref: "User", // reference to User model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  notes: { type: String },
  purchased: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ToBuyItem", toBuyItemSchema);
