const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ============ ALL YOUR SCENARIOS ============
const allScenarios = [
    {
        "_id": "69bc2f679ebc82c2ad9bf465",
        "title": "Budget Crisis Mid-Project",
        "role": "Project Manager",
        "description": "Your project is 60% complete but the client has just cut the budget by 30%. The team is worried, key deliverables are at risk, and the deadline hasn't changed. How do you respond?",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Reduce team size and cut scope", "impacts": {"cost": 25, "time": 5, "quality": -20, "morale": -25, "satisfaction": -15}},
            {"option": "Negotiate deadline extension with client", "impacts": {"cost": -5, "time": -20, "quality": 10, "morale": 10, "satisfaction": -10}},
            {"option": "Absorb the cut and push the team harder", "impacts": {"cost": 15, "time": 5, "quality": -10, "morale": -30, "satisfaction": 5}},
            {"option": "Re-prioritise with client and deliver MVP", "impacts": {"cost": 20, "time": 10, "quality": -5, "morale": 5, "satisfaction": 15}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf46a",
        "title": "Key Developer Resigns",
        "role": "Project Manager",
        "description": "Your lead developer — the only person who understands the core architecture — has resigned with 2 weeks notice. The project goes live in 6 weeks.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Hire a contractor immediately", "impacts": {"cost": -25, "time": 5, "quality": -5, "morale": 5, "satisfaction": 5}},
            {"option": "Redistribute work across the team", "impacts": {"cost": 10, "time": -15, "quality": -15, "morale": -20, "satisfaction": -10}},
            {"option": "Request knowledge transfer sessions", "impacts": {"cost": -5, "time": -10, "quality": 5, "morale": 10, "satisfaction": 10}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf46e",
        "title": "Production System is Down",
        "role": "Software Engineer",
        "description": "It's 2 AM. The production API is returning 500 errors for 40% of users. You're on-call. Logs show a recent deployment may have introduced a memory leak.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Rollback the deployment immediately", "impacts": {"cost": -5, "time": 20, "quality": 15, "morale": 10, "satisfaction": 25}},
            {"option": "Hotfix and redeploy", "impacts": {"cost": -10, "time": -15, "quality": 10, "morale": 5, "satisfaction": 10}},
            {"option": "Scale up servers to buy time", "impacts": {"cost": -20, "time": 10, "quality": 5, "morale": 5, "satisfaction": 5}},
            {"option": "Wake up the team lead for guidance", "impacts": {"cost": -5, "time": -10, "quality": 5, "morale": -5, "satisfaction": -5}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf473",
        "title": "Technical Debt Showdown",
        "role": "Software Engineer",
        "description": "The codebase has accumulated 18 months of technical debt. New features are taking 3x longer to build. Management wants a new feature shipped in 2 weeks.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Ship the feature, ignore the debt", "impacts": {"cost": 10, "time": 20, "quality": -20, "morale": -15, "satisfaction": 10}},
            {"option": "Refactor first, delay the feature", "impacts": {"cost": -10, "time": -20, "quality": 25, "morale": 15, "satisfaction": -15}},
            {"option": "Propose a parallel track", "impacts": {"cost": -15, "time": -5, "quality": 10, "morale": 10, "satisfaction": 5}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf477",
        "title": "Mass Casualty Triage",
        "role": "Medical Officer",
        "description": "A road accident has brought 12 patients to your ER simultaneously. You have 3 doctors and 6 nurses available. Some patients are critical, others stable. Resources are stretched.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Prioritise the most critical patients first", "impacts": {"cost": -10, "time": -10, "quality": 20, "morale": 5, "satisfaction": 15}},
            {"option": "Apply standard triage protocol", "impacts": {"cost": -5, "time": -15, "quality": 15, "morale": 15, "satisfaction": 20}},
            {"option": "Call in off-duty staff immediately", "impacts": {"cost": -20, "time": -10, "quality": 10, "morale": 20, "satisfaction": 10}},
            {"option": "Redirect stable patients to another facility", "impacts": {"cost": 5, "time": 10, "quality": 10, "morale": 5, "satisfaction": -5}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf47c",
        "title": "Experimental Treatment Decision",
        "role": "Medical Officer",
        "description": "A 45-year-old patient with aggressive cancer has exhausted standard treatments. An experimental drug shows 40% success in trials but carries serious side effects. The family is pushing for it.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Approve the experimental treatment", "impacts": {"cost": -20, "time": -5, "quality": 10, "morale": 5, "satisfaction": 15}},
            {"option": "Recommend palliative care", "impacts": {"cost": 15, "time": 10, "quality": 5, "morale": -10, "satisfaction": -10}},
            {"option": "Seek a second specialist opinion", "impacts": {"cost": -10, "time": -10, "quality": 15, "morale": 10, "satisfaction": 5}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf480",
        "title": "Workplace Harassment Complaint",
        "role": "HR Manager",
        "description": "A junior employee has filed a harassment complaint against a senior manager who leads a high-revenue team. The complaint is credible but the manager denies everything.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Launch a formal investigation immediately", "impacts": {"cost": -15, "time": -15, "quality": 10, "morale": 20, "satisfaction": 10}},
            {"option": "Mediate informally between both parties", "impacts": {"cost": 5, "time": 5, "quality": -5, "morale": -10, "satisfaction": -15}},
            {"option": "Transfer the complainant to another team", "impacts": {"cost": 5, "time": 10, "quality": -10, "morale": -25, "satisfaction": -20}},
            {"option": "Bring in an external investigator", "impacts": {"cost": -20, "time": -10, "quality": 15, "morale": 15, "satisfaction": 15}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf485",
        "title": "Mass Layoff Communication",
        "role": "HR Manager",
        "description": "The company must lay off 15% of staff due to financial losses. Leadership wants it done in 48 hours. You need to manage the process humanely while minimising legal risk.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Execute quickly with standard severance", "impacts": {"cost": 20, "time": 20, "quality": -10, "morale": -30, "satisfaction": -20}},
            {"option": "Request more time for proper offboarding", "impacts": {"cost": -10, "time": -15, "quality": 10, "morale": 10, "satisfaction": 10}},
            {"option": "Offer voluntary redundancy first", "impacts": {"cost": -15, "time": -10, "quality": 5, "morale": 20, "satisfaction": 15}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf489",
        "title": "ICU Bed Shortage",
        "role": "Hospital Administrator",
        "description": "A flu outbreak has filled all 20 ICU beds. 5 more critical patients are incoming from a regional hospital. You have no spare capacity and staff are already exhausted.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Convert a recovery ward into temporary ICU", "impacts": {"cost": -20, "time": -10, "quality": 10, "morale": -10, "satisfaction": 15}},
            {"option": "Transfer stable ICU patients to step-down care", "impacts": {"cost": -5, "time": 5, "quality": 15, "morale": 5, "satisfaction": 20}},
            {"option": "Redirect incoming patients to another hospital", "impacts": {"cost": 10, "time": -5, "quality": -10, "morale": 10, "satisfaction": -15}},
            {"option": "Call a regional emergency and request support", "impacts": {"cost": -15, "time": -15, "quality": 10, "morale": 15, "satisfaction": 10}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf48e",
        "title": "Cloud Cost Explosion",
        "role": "DevOps Engineer",
        "description": "This month's AWS bill is 4x the usual amount. A misconfigured auto-scaling policy spun up hundreds of instances overnight. Finance is demanding answers and immediate action.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Terminate all excess instances immediately", "impacts": {"cost": 30, "time": 5, "quality": -5, "morale": 5, "satisfaction": 10}},
            {"option": "Fix the auto-scaling policy first, then clean up", "impacts": {"cost": 20, "time": -5, "quality": 15, "morale": 10, "satisfaction": 15}},
            {"option": "Set hard budget alerts and caps", "impacts": {"cost": 15, "time": 5, "quality": 10, "morale": 5, "satisfaction": 10}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf492",
        "title": "Exam Integrity Breach",
        "role": "Academic Coordinator",
        "description": "Evidence suggests that exam questions for a final assessment were leaked to a student group 24 hours before the exam. 200 students are scheduled to sit it tomorrow morning.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Postpone the exam and create a new paper", "impacts": {"cost": -15, "time": -20, "quality": 20, "morale": -10, "satisfaction": -10}},
            {"option": "Proceed but investigate after", "impacts": {"cost": 5, "time": 10, "quality": -20, "morale": -5, "satisfaction": -15}},
            {"option": "Identify and isolate the affected students", "impacts": {"cost": -10, "time": -10, "quality": 10, "morale": 5, "satisfaction": 5}},
            {"option": "Report to academic integrity board immediately", "impacts": {"cost": -5, "time": -15, "quality": 15, "morale": 10, "satisfaction": 10}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf497",
        "title": "Ransomware Attack Detected",
        "role": "Cybersecurity Analyst",
        "description": "At 9 AM, your SIEM alerts show ransomware spreading across the internal network. 3 file servers are already encrypted. The attacker is demanding $200,000 in Bitcoin.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Isolate infected systems immediately", "impacts": {"cost": -10, "time": -10, "quality": 20, "morale": 10, "satisfaction": 15}},
            {"option": "Pay the ransom to restore operations fast", "impacts": {"cost": -40, "time": 20, "quality": -10, "morale": -20, "satisfaction": -10}},
            {"option": "Restore from backups and rebuild", "impacts": {"cost": -20, "time": -20, "quality": 15, "morale": 5, "satisfaction": 10}},
            {"option": "Engage a cybersecurity incident response firm", "impacts": {"cost": -25, "time": -5, "quality": 20, "morale": 15, "satisfaction": 20}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf49c",
        "title": "Feature vs. Stability Dilemma",
        "role": "Product Manager",
        "description": "Your app has a 2.8-star rating due to bugs. Marketing wants a major new feature launched next month for a conference. Engineering says they need 6 weeks just to fix existing issues.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Delay the feature, fix bugs first", "impacts": {"cost": -5, "time": -15, "quality": 25, "morale": 15, "satisfaction": 20}},
            {"option": "Launch the feature on schedule", "impacts": {"cost": 10, "time": 20, "quality": -20, "morale": -15, "satisfaction": -15}},
            {"option": "Ship a smaller feature with bug fixes bundled", "impacts": {"cost": -5, "time": 5, "quality": 10, "morale": 10, "satisfaction": 10}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf4a0",
        "title": "Release Day Critical Bug",
        "role": "QA Engineer",
        "description": "It's release day. During final smoke testing you find a critical bug that corrupts user data under a specific edge case. The CEO has already announced the launch on social media.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Block the release and report the bug", "impacts": {"cost": -10, "time": -20, "quality": 30, "morale": 10, "satisfaction": -10}},
            {"option": "Release with a known issue flag", "impacts": {"cost": -5, "time": 15, "quality": -20, "morale": -10, "satisfaction": -20}},
            {"option": "Disable the affected feature and release", "impacts": {"cost": -5, "time": 10, "quality": 5, "morale": 5, "satisfaction": 5}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf4a4",
        "title": "Staff Shortage on Night Shift",
        "role": "Nursing Supervisor",
        "description": "Three nurses called in sick for tonight's night shift. The ward has 28 patients, 6 of whom are high-dependency. You have 4 nurses available instead of the required 7.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Call agency nurses to fill the gaps", "impacts": {"cost": -25, "time": 5, "quality": 10, "morale": 10, "satisfaction": 15}},
            {"option": "Ask day shift nurses to stay on overtime", "impacts": {"cost": -15, "time": 5, "quality": 5, "morale": -15, "satisfaction": 5}},
            {"option": "Redistribute patients to other wards", "impacts": {"cost": -5, "time": -10, "quality": 5, "morale": 5, "satisfaction": -5}},
            {"option": "Proceed with reduced staff and prioritise HDU", "impacts": {"cost": 10, "time": 5, "quality": -15, "morale": -20, "satisfaction": -15}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf4a9",
        "title": "Teacher Strike Threat",
        "role": "School Administrator",
        "description": "Teachers are threatening a strike over workload and pay. Exams are in 3 weeks. Parents are alarmed. The school board has not approved any budget increase.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Negotiate workload reduction without pay rise", "impacts": {"cost": 5, "time": 5, "quality": 10, "morale": 15, "satisfaction": 10}},
            {"option": "Escalate to the school board for emergency funding", "impacts": {"cost": -15, "time": -10, "quality": 10, "morale": 20, "satisfaction": 15}},
            {"option": "Bring in substitute teachers as contingency", "impacts": {"cost": -20, "time": -5, "quality": -15, "morale": -20, "satisfaction": -10}}
        ]
    },
    {
        "_id": "69bc2f679ebc82c2ad9bf4ad",
        "title": "Supply Chain Disruption",
        "role": "Operations Manager",
        "description": "Your primary supplier has halted shipments due to a factory fire. You have 10 days of inventory left. Production will stop without raw materials. Clients are expecting delivery next month.",
        "initialMetrics": {"cost": 100, "time": 100, "quality": 100, "morale": 100, "satisfaction": 100},
        "decisions": [
            {"option": "Source from an emergency backup supplier", "impacts": {"cost": -30, "time": 10, "quality": -5, "morale": 5, "satisfaction": 15}},
            {"option": "Notify clients and negotiate delivery delays", "impacts": {"cost": 5, "time": -15, "quality": 5, "morale": 10, "satisfaction": -15}},
            {"option": "Reduce production to stretch existing inventory", "impacts": {"cost": 10, "time": -10, "quality": -5, "morale": -5, "satisfaction": -10}},
            {"option": "Fly in materials via air freight", "impacts": {"cost": -35, "time": 20, "quality": 10, "morale": 10, "satisfaction": 20}}
        ]
    }
];

// ============ HEALTH CHECK ENDPOINTS ============

app.get("/api", (req, res) => {
    res.json({ 
        message: "Backend API is running on Vercel!",
        endpoints: ["/api/test", "/api/register", "/api/login", "/api/scenarios/:role"],
        total_scenarios: allScenarios.length
    });
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working on Vercel!" });
});

// ============ AUTH ENDPOINTS ============

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

app.post("/api/login", async (req, res) => {
    try {
        console.log("Login request:", req.body);
        const { email, password } = req.body;
        
        const user = {
            _id: "temp_id_" + Date.now(),
            name: email.split('@')[0],
            email: email,
            role: "Manager"
        };
        
        res.json({ success: true, message: "Login received", user: user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ SCENARIOS ENDPOINTS ============

// Get all scenarios
app.get("/api/scenarios", (req, res) => {
    res.json(allScenarios);
});

// Get scenarios by role
app.get("/api/scenarios/:role", (req, res) => {
    const role = req.params.role;
    const filteredScenarios = allScenarios.filter(s => 
        s.role.toLowerCase() === role.toLowerCase()
    );
    res.json(filteredScenarios);
});

// Get single scenario by ID
app.get("/api/scenario/:id", (req, res) => {
    const id = req.params.id;
    const scenario = allScenarios.find(s => s._id === id);
    if (scenario) {
        res.json(scenario);
    } else {
        res.status(404).json({ error: "Scenario not found" });
    }
});

// ============ EXPORT FOR VERCEL ============
module.exports = app;