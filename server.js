const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // Load .env file

const app = express();
app.use(express.json()); // Enable JSON body parsing
app.use(cors()); // Enable CORS

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // MongoDB Connection String

// 🔹 Debugging: Print MONGO_URI
console.log("MongoDB URI:", MONGO_URI);

// Import User Model
const User = require("./models/User");

// 🔹 MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");
    
    // Example Call: Insert a Test User with Custom Data
    insertUser("Ravi", "ravi@example.com", "ravi98768");
  })
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

/**
 * 🔹 Function to Insert a User (Prevents Duplicate Insertion)
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
const insertUser = async (name, email, password) => {
  try {
    const existingUser = await User.findOne({ email });

    console.log("🔍 Checking Existing User:", existingUser); // Debugging Line

    if (existingUser) {
      console.log(`⚠️ User with email '${email}' already exists, skipping insertion.`);
      return;
    }

    const newUser = new User({ name, email, password });

    await newUser.save();
    console.log(`✅ New user '${newUser.name}' inserted with email '${newUser.email}'`);
  } catch (error) {
    console.log("❌ Error Inserting User:", error);
  }
};

// 🔹 API Route to Insert a User Manually (via URL Params)
app.post("/api/insert-user", async (req, res) => {
  try {
    const { name, email, password } = req.body; // Get user details from request body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "⚠️ Name, email, and password are required." });
    }

    await insertUser(name, email, password);

    res.status(201).json({ message: `✅ User '${name}' added successfully!` });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to add user", details: error });
  }
});

// Import User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// 🔹 Basic API Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔹 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
