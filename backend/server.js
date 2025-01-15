const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
const productRoutes = require("./routes/productRoutes");
const apiRoutes = require("./routes/api");
const reviewRoutes = require("./routes/reviewRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 1000;

// Middleware to parse JSON
app.use(express.json());
// Use CORS middleware
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/buyEase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", apiRoutes);
app.use("/api/reviews", reviewRoutes); // Mount review routes here


// toBuy Routes:
const toBuyRoutes = require("./routes/toBuyRoutes");
app.use("/api/to-buy", toBuyRoutes);


app.get("/", (req, res) => {
  res.send("Hello from the backend Buy Ease!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
