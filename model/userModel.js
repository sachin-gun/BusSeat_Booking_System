const mongoose = require('mongoose');
const { useDatabase } = require('..//config//db'); // Import the route_serviceDB connection


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone_number: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ntc', 'bus_operator', 'commuter'], required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const userServiceDB = useDatabase('user_service')
const User = userServiceDB.model('User', UserSchema);


module.exports = User;