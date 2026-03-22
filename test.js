const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());  // THIS IS CRITICAL for reading JSON data
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/role-simulation")
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB error:", err));

// ============ USER SCHEMA ============
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ["Manager", "Engineer", "Doctor"] }
});
const User = mongoose.model("User", userSchema);

// ============ SCENARIO SCHEMA ============
const scenarioSchema = new mongoose.Schema({
    title: String,
    role: String,
    description: String,
    decisions: [{
        option: String,
        impacts: {
            cost: Number,
            time: Number,
            quality: Number,
            morale: Number,
            satisfaction: Number
        }
    }]
});
const Scenario = mongoose.model("Scenario", scenarioSchema);

// ============ API ROUTES ============

// Register user
app.post("/api/register", async (req, res) => {
    try {
        console.log("Register request received:", req.body); // Debug log
        const user = new User(req.body);
        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Login user
app.post("/api/login", async (req, res) => {
    try {
        console.log("Login request received:", req.body); // Debug log
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get all users (for testing)
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get scenarios by role
app.get("/api/scenarios/:role", async (req, res) => {
    try {
        const scenarios = await Scenario.find({ role: req.params.role });
        res.json(scenarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create scenario
app.post("/api/scenarios", async (req, res) => {
    try {
        console.log("Create scenario request:", req.body); // Debug log
        const scenario = new Scenario(req.body);
        await scenario.save();
        res.json(scenario);
    } catch (err) {
        console.error("Create scenario error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ============ TEST ROUTES ============
app.get("/", (req, res) => {
    res.send("Role-Based Decision Simulation API 🚀");
});

app.get("/test-users", (req, res) => {
    res.json({ 
        success: true, 
        message: "TEST-USERS ROUTE WORKS!",
        data: ["user1", "user2", "user3"]
    });
});

app.get("/api", (req, res) => {
    res.json({ 
        success: true, 
        message: "API ROUTE WORKS!",
        endpoints: [
            "/",
            "/test-users",
            "/api",
            "/api/users (GET)",
            "/api/register (POST)",
            "/api/login (POST)",
            "/api/scenarios/:role (GET)",
            "/api/scenarios (POST)"
        ]
    });
});

// ============ START SERVER ============
const PORT = 3000;
app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("🚀 SERVER IS RUNNING!");
    console.log("=".repeat(50));
    console.log(`📍 http://localhost:${PORT}/`);
    console.log(`📍 http://localhost:${PORT}/test-users`);
    console.log(`📍 http://localhost:${PORT}/api`);
    console.log("\n📌 API Endpoints:");
    console.log("   GET  /api/users");
    console.log("   POST /api/register");
    console.log("   POST /api/login");
    console.log("   GET  /api/scenarios/:role");
    console.log("   POST /api/scenarios");
    console.log("=".repeat(50));
});