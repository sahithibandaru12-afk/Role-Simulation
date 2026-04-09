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
        const { name, email, password } = req.body;
        
        const user = {
            _id: "temp_id_" + Date.now(),
            name: name,
            email: email,
            role: "Manager"
        };
        
        res.json({ success: true, message: "Registration received", user: user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    try {
        console.log("Login request:", req.body);
        const { email, password } = req.body;
        
        // For testing, create a user object from the request
        // In real app, you would fetch from database
        const user = {
            _id: "temp_id_" + Date.now(),
            name: email.split('@')[0],  // Use part before @ as name
            email: email,
            role: "Manager"  // Default role
        };
        
        res.json({ 
            success: true, 
            message: "Login received", 
            user: user 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ============ EXPORT FOR VERCEL ============
module.exports = app;