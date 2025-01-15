// routes/api.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Product = require("../models/Product");
const productRoutes = require("./productRoutes");
const auth = require("../middleware/authMiddleware");
const orderRoutes = require("./orderRoutes");

const router = express.Router();

// Mount product routes at /products
// This delegates all product-related routes to the `productRoutes` file:
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

// Existing product routes
router.get("/", (req, res) => {
  res.send("Hello from the API!");
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    console.log("Running the get request for products");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/products", auth, async (req, res) => {
  try {
    // console.log("running here");
    const { name, price, description, category, seller } = req.body;
    // console.log("this is req.user: ", req.user);
    // console.log(req.body);
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from Authorization header if present else unfefined
    // console.log(req.header("Authorization"));
    // console.log(token);
    const newProduct = new Product({
      name,
      price,
      description,
      category, // Selected
      seller: req.user.userId, // replace by token or what? nvm resolved
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("error here");
    res.status(500).json({ message: "Failed to create product", error });
  }
});

// Register Route
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
        expiresIn: "1h",
      });
      // your_jwt_secret should be replaced with an actual secret in production
      //
      res.json({ token });
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

// Get of the logged-in user
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, "name email"); // Only return name and email
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

// User profile route
router.patch("/profile", auth, async (req, res) => {
  const { name, email, password, currentPassword, newPassword, notificationsEnabled  } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    // Handle notificationsEnabled update
    if (typeof notificationsEnabled === "boolean") {
      user.notificationsEnabled = notificationsEnabled;
    }

    // Handle password update if currentPassword and newPassword are provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: { name: user.name, email: user.email, notificationsEnabled: user.notificationsEnabled },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Export the router

const Message = require("../models/Message");

// send messages
router.post("/messages", async (req, res) => {
  const { sender, receiver, content } = req.body;

  if (!sender || !receiver || !content) {
    return res.status(400).json({ error: "Sender, receiver, and content are required." });
  }

  try {
    const newMessage = new Message({ sender, receiver, content });
    console.log("Saving message:", newMessage);
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// Get messages between two users
router.get("/messages/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;

  if (!sender || !receiver) {
    return res.status(400).json({ error: "Sender and receiver are required." });
  }

  console.log(`Fetching messages between sender: ${sender} and receiver: ${receiver}`);

  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages || []); // return empty array
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

router.get("/all-chats/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Find all messages where the user is the sender or receiver
    const messages = await Message.find({
      $or: [{ sender: username }, { receiver: username }],
    }).sort({ timestamp: -1 }); // Sort by latest message first

    // Extract unique chat partners
    const uniqueChats = Array.from(
      new Map(
        messages
          // Exclude self-messages (sender === receiver === username)
          .filter((msg) => msg.sender !== msg.receiver)
          // Map each message to the chat partner and timestamp
          .map((msg) => {
            const chatPartner = msg.sender === username ? msg.receiver : msg.sender;
            return [chatPartner, { name: chatPartner, timestamp: msg.timestamp }];
          })
      ).values() // Ensure unique chat partners
    );

    res.json(uniqueChats); // Send the list of unique chat partners
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});


module.exports = router;
