// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: String,
    otp: String,
    isActivated: { type: Boolean, default: false }, // Add this line
});

module.exports = mongoose.model('User', userSchema);
