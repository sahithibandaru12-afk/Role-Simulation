const mongoose = require("mongoose");

// Define what a User looks like in database
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Manager", "Engineer", "Doctor"], // Only these 3 roles allowed
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the User model
module.exports = mongoose.model("User", userSchema);