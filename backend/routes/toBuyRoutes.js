// backend/routes/toBuyRoutes.js
const express = require("express");
const router = express.Router();
const ToBuyItem = require("../models/ToBuyItem"); // Import ToBuyItem model
const Product = require("../models/Product"); // Import Product model

// GET route for fetching all to-buy items for the authenticated user
router.post("/getBuyList", async (req, res) => {
  console.log(req.body);
  try {
    const userId = req.body?.userId; // Extract userId from the authenticated request
    const items = await ToBuyItem.find({ user: userId }).populate("product");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching to-buy items", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body; // Accept userId from the frontend

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const newItem = new ToBuyItem({
      product: product._id,
      user: userId, // Use the userId directly from the request body
      quantity,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error adding item to To-Buy List:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// DELETE route for removing an item from the to-buy list
router.delete("/delete", async (req, res) => {
  try {
    const { userId, itemId } = req.body; // Accept userId and itemId from the frontend

    // Find and delete the item
    const deletedItem = await ToBuyItem.findOneAndDelete({
      user: userId,
      _id: itemId,
    });
    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

module.exports = router;
