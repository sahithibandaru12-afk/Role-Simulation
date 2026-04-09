const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ============ API ENDPOINTS ============

// Health check endpoint
app.get("/api", (req, res) => {
    res.json({ 
        message: "Backend API is running on Vercel!",
        endpoints: ["/api/test", "/api/register", "/api/login"]
    });
});

// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working on Vercel!" });
});

// Register endpoint
app.post("/api/register", async (req, res) => {
    try {
        console.log("Register request:", req.body);
        res.json({ success: true, message: "Registration received", user: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    try {
        console.log("Login request:", req.body);
        res.json({ success: true, message: "Login received", user: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ EXPORT FOR VERCEL ============
module.exports = app;