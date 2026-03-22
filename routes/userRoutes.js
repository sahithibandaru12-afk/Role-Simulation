const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER API - POST /api/users/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        
        // Create new user
        const user = new User({
            name,
            email,
            password, // In real app, you'd hash this password
            role
        });
        
        await user.save();
        
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGIN API - POST /api/users/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        // Check password (in real app, compare hashed passwords)
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ALL USERS - GET /api/users
router.get("/", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;