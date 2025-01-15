// routes/orderRoutes.js
const express = require("express");
const auth = require("../middleware/authMiddleware"); // Ensure the auth middleware is correctly imported
const Order = require("../models/Order");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from the orders API!");
});

// GET /api/orders/history - Retrieve transaction history for the logged-in user
router.get("/history", auth, async (req, res) => {
  //res.send("Hello from the orders history API!");
  try {
    const orders = await Order.find({ buyer: req.user.userId }).sort({
      purchaseDate: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving transaction history:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve transaction history", error });
  }
});

// POST /api/orders - Create a new order
router.post("/", auth, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;
    //console.log("testing orders here");
    const newOrder = new Order({
      buyer: req.user.userId, // Attach the authenticated user
      items,
      totalAmount,
      paymentMethod,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
});

module.exports = router;
