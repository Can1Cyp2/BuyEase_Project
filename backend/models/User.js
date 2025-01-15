// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, 
  notificationsEnabled: { type: Boolean, default: true }, // New field for notifications
});

module.exports = mongoose.model("User", userSchema);
