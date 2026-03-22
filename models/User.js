const mongoose = require("mongoose");

const ROLES = [
    "Project Manager", "Operations Manager", "Product Manager", "Business Analyst",
    "HR Manager", "Marketing Manager", "Financial Manager", "Startup Founder",
    "Software Engineer", "Systems Engineer", "Network Admin", "Data Engineer",
    "Cybersecurity Analyst", "DevOps Engineer", "QA Engineer", "IT Project Lead",
    "Hospital Administrator", "Medical Officer", "Nursing Supervisor", "Emergency Coordinator",
    "Healthcare Ops Manager", "Clinical Analyst", "Public Health Officer",
    "Academic Coordinator", "School Administrator", "Curriculum Designer",
    "Examination Controller", "Education Policy Analyst", "Training Manager"
];

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ROLES },
    createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
