const mongoose = require('mongoose');
const { useDatabase } = require('../config/db');

// Define the Bus Schema
const BusSchema = new mongoose.Schema({
    operator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOperator', required: true }, // Reference to BusOperator
    bus_number: { type: String, required: true, unique: true, trim: true }, // Unique bus identifier (e.g., license plate)
    seats_count: { type: Number, required: true, min: 1 }, // Total number of seats
    permit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Permit' }, // Reference to Permit
    status: { type: String, enum: ['active', 'inactive', 'under_maintenance'], default: 'active' }, // Bus status
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware: Automatically update `updated_at` field
BusSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Static method: Find buses by operator
BusSchema.statics.findByOperator = function (operatorId) {
    return this.find({ operator_id: operatorId });
};

// Static method: Update permit status
BusSchema.statics.updatePermitStatus = async function (busId, permitStatus) {
    return this.findByIdAndUpdate(busId, { permit_status: permitStatus }, { new: true });
};

// Bind the schema to the specific database
const busServiceDB = useDatabase('bus_seat_booking_service');
const Bus = busServiceDB.model('Bus', BusSchema);

module.exports = Bus;
