const mongoose = require('mongoose');
const { permitServiceDB } = require('../db'); // Import the permit_serviceDB connection

const PermitSchema = new mongoose.Schema({
    permitId: { type: String, required: true, unique: true },
    licensePlate: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    permitRegisteredDate: { type: Date, default: Date.now },
    validThrough: { type: Date },
    status: { type: String, enum: ['pending', 'approved','rejected'], default: 'pending' }
});

// Use the permitServiceDB connection for the Permit model
module.exports = permitServiceDB.model('Permit', PermitSchema);