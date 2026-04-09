const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");  // COMMENT THIS

const app = express();
app.use(express.json());
app.use(cors());

// COMMENT THIS ENTIRE BLOCK
// mongoose.connect("mongodb://127.0.0.1:27017/role-simulation")
// .then(() => console.log("✅ Connected to MongoDB"))
// .catch(err => console.error("❌ MongoDB error:", err));

// ============ USER SCHEMA (COMMENT THIS TOO) ============
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
//     role: String
// });
// const User = mongoose.model("User", userSchema);

// ============ SIMPLE TEST API (NO DATABASE) ============
app.post("/api/register", async (req, res) => {
    try {
        console.log("Register request:", req.body);
        // Simple response without database
        res.json({ success: true, message: "Registration received", user: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        console.log("Login request:", req.body);
        // Simple response without database
        res.json({ success: true, message: "Login received", user: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ TEST API ============
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working on Vercel!" });
});

// ============ EXPORT FOR VERCEL ============
module.exports = app;