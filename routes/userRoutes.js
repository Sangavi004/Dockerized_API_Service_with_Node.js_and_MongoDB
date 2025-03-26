const express = require("express");
const User = require("../models/User"); // Import User Model
const router = express.Router();

// 🔹 Register User Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// 🔹 FIX: Add GET route to fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from MongoDB
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

module.exports = router;
