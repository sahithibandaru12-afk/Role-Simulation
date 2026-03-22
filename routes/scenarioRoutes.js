const express = require("express");
const router = express.Router();
const Scenario = require("../models/Scenario");

// GET SCENARIOS BY ROLE - GET /api/scenarios/:role
router.get("/:role", async (req, res) => {
    try {
        const scenarios = await Scenario.find({ 
            role: req.params.role 
        });
        res.json(scenarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET SINGLE SCENARIO - GET /api/scenario/:id
router.get("/scenario/:id", async (req, res) => {
    try {
        const scenario = await Scenario.findById(req.params.id);
        if (!scenario) {
            return res.status(404).json({ error: "Scenario not found" });
        }
        res.json(scenario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE SCENARIO (for admin) - POST /api/scenarios
router.post("/", async (req, res) => {
    try {
        const scenario = new Scenario(req.body);
        await scenario.save();
        res.status(201).json(scenario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SUBMIT DECISION - POST /api/scenarios/:id/decide
router.post("/:id/decide", async (req, res) => {
    try {
        const scenario = await Scenario.findById(req.params.id);
        const decision = scenario.decisions.id(req.body.decisionId);
        
        // Calculate results based on decision impacts
        const results = {
            cost: scenario.initialMetrics.cost + decision.impacts.cost,
            time: scenario.initialMetrics.time + decision.impacts.time,
            quality: scenario.initialMetrics.quality + decision.impacts.quality,
            morale: scenario.initialMetrics.morale + decision.impacts.morale,
            satisfaction: scenario.initialMetrics.satisfaction + decision.impacts.satisfaction
        };
        
        res.json({
            message: "Decision processed",
            decision: decision.option,
            results,
            nextScenario: decision.nextScenario
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;