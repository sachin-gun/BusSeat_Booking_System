const mongoose = require('mongoose');
const { userServiceDB } = require('../db'); // Import the user_serviceDB connection

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ntc', 'bus_operator', 'commuter'], required: true },
    phoneNumber: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    lastLogin: { type: Date }
});

// Use the userServiceDB connection for the User model
module.exports = userServiceDB.model('User', UserSchema);