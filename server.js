const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Scenario = require("./models/Scenario");

const SALT_ROUNDS = 10;

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend")));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/role-simulation")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB error:", err));

// ── Register ──
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already registered" });

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = new User({ name, email, password: hashed });
        await user.save();
        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("❌ Register error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── Login ──
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── Get all users ──
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Get scenarios by role ──
app.get("/api/scenarios/:role", async (req, res) => {
    try {
        const scenarios = await Scenario.find({ role: req.params.role });
        res.json(scenarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Get all scenarios ──
app.get("/api/scenarios", async (req, res) => {
    try {
        const scenarios = await Scenario.find();
        res.json(scenarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Create scenario ──
app.post("/api/scenarios", async (req, res) => {
    try {
        const scenario = new Scenario(req.body);
        await scenario.save();
        res.status(201).json(scenario);
    } catch (err) {
        console.error("❌ Create scenario error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ── API info ──
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Role-Based Decision Simulation API",
        endpoints: [
            "POST /api/register",
            "POST /api/login",
            "GET  /api/users",
            "GET  /api/scenarios",
            "GET  /api/scenarios/:role",
            "POST /api/scenarios"
        ]
    });
});

// ── Fallback to index.html ──
app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n${"=".repeat(45)}`);
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`${"=".repeat(45)}`);
});
