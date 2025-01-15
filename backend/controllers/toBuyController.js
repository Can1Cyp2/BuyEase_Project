// backend/controllers/toBuyController.js
const ToBuyItem = require("../models/ToBuyItem");

exports.getAllItems = async (req, res) => {
  try {
    const items = await ToBuyItem.find({ userId: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

exports.addItem = async (req, res) => {
  const { name, quantity, priority, notes } = req.body;

  try {
    const newItem = new ToBuyItem({
      name,
      quantity,
      priority,
      notes,
      userId: req.user.id,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to add item" });
  }
};

exports.updateItem = async (req, res) => {
  const { purchased } = req.body;

  try {
    const updatedItem = await ToBuyItem.findByIdAndUpdate(
      req.params.id,
      { purchased },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to update item" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await ToBuyItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};
