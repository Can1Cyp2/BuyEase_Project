const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Route to get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a single product by ID
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('seller', 'name email');;
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to upload an image for a product
router.post("/upload", auth, upload.single("image"), async (req, res) => {
  try {
    const { productId } = req.body;

    // Ensure an image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product's imageUrl field
    product.imageUrl = `/uploads/${req.file.filename}`;
    await product.save();

    res.status(200).json({ message: "Image uploaded successfully", product });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Failed to upload image", error });
  }
});

module.exports = router;
