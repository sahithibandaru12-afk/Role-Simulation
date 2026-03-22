const mongoose = require("mongoose");

const scenarioSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    role:        { type: String, required: true },
    description: { type: String, required: true },
    initialMetrics: {
        cost:         { type: Number, default: 100 },
        time:         { type: Number, default: 100 },
        quality:      { type: Number, default: 100 },
        morale:       { type: Number, default: 100 },
        satisfaction: { type: Number, default: 100 }
    },
    decisions: [{
        option:      String,
        description: String,
        impacts: {
            cost:         Number,
            time:         Number,
            quality:      Number,
            morale:       Number,
            satisfaction: Number
        },
        nextScenario: String
    }]
});

module.exports = mongoose.model("Scenario", scenarioSchema);
