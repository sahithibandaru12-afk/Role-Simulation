const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/role-simulation")
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB error:", err));

// ============ USER SCHEMA with ALL ROLES ============
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { 
        type: String, 
        enum: [
            // Management & Business
            "Project Manager",
            "Operations Manager", 
            "Product Manager",
            "Business Analyst",
            "HR Manager",
            "Marketing Manager",
            "Financial Manager",
            "Startup Founder",
            
            // Engineering & Technology
            "Software Engineer",
            "Systems Engineer",
            "Network Admin",
            "Data Engineer",
            "Cybersecurity Analyst",
            "DevOps Engineer",
            "QA Engineer",
            "IT Project Lead",
            
            // Healthcare & Medical
            "Hospital Administrator",
            "Medical Officer",
            "Nursing Supervisor",
            "Emergency Coordinator",
            "Healthcare Ops Manager",
            "Clinical Analyst",
            "Public Health Officer",
            
            // Education & Training
            "Academic Coordinator",
            "School Administrator",
            "Curriculum Designer",
            "Examination Controller",
            "Education Policy Analyst",
            "Training Manager"
        ]
    }
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
        console.log("📝 Register request received:", req.body);
        const user = new User(req.body);
        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        console.error("❌ Register error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Login user
app.post("/api/login", async (req, res) => {
    try {
        console.log("🔑 Login request received:", req.body);
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get all users
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
        console.log("📝 Create scenario request:", req.body);
        const scenario = new Scenario(req.body);
        await scenario.save();
        res.json(scenario);
    } catch (err) {
        console.error("❌ Create scenario error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get all scenarios
app.get("/api/scenarios", async (req, res) => {
    try {
        const scenarios = await Scenario.find();
        res.json(scenarios);
    } catch (err) {
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
        message: "Test users route works!",
        users: [
            { name: "John", role: "Project Manager" },
            { name: "Jane", role: "Software Engineer" },
            { name: "Bob", role: "Medical Officer" },
            { name: "Alice", role: "Academic Coordinator" }
        ]
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
            "/api/register (POST)",
            "/api/login (POST)",
            "/api/users (GET)",
            "/api/scenarios (GET)",
            "/api/scenarios/:role (GET)",
            "/api/scenarios (POST)"
        ]
    });
});

// ============ START SERVER ============
const PORT = 3000;
app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("🚀 SERVER STARTED WITH FULL API!");
    console.log("=".repeat(50));
    console.log(`📍 http://localhost:${PORT}/`);
    console.log(`📍 http://localhost:${PORT}/test-users`);
    console.log(`📍 http://localhost:${PORT}/api`);
    console.log("\n📌 API Endpoints Available:");
    console.log("   POST /api/register");
    console.log("   POST /api/login");
    console.log("   GET  /api/users");
    console.log("   GET  /api/scenarios");
    console.log("   GET  /api/scenarios/:role");
    console.log("   POST /api/scenarios");
    console.log("=".repeat(50));
    console.log("\n👥 Available Roles:", userSchema.path('role').enumValues.length);
    console.log("=".repeat(50));
});