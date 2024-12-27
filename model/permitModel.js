const mongoose = require('mongoose');
const { useDatabase } = require('../config/db');

const PermitSchema = new mongoose.Schema({
    bus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true }, 
    operator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BusOperator', required: true }, 
    permit_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Current permit status
    requested_at: { type: Date, default: Date.now }, // Timestamp for when the permit was requested
    approved_at: { type: Date }, // Timestamp for approval (if approved)
    rejected_at: { type: Date }, // Timestamp for rejection (if rejected)
    comments: { type: String, trim: true }, // Optional comments or notes
    created_at: { type: Date, default: Date.now }, // Record creation timestamp
    updated_at: { type: Date, default: Date.now } // Record update timestamp
});

// Middleware: Automatically update `updated_at` field
PermitSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Static method: Find permits by status
PermitSchema.statics.findByStatus = function (status) {
    return this.find({ permit_status: status });
};

// Static method: Update permit status
PermitSchema.statics.updateStatus = async function (permitId, status, comments = '') {
    const update = { permit_status: status, comments };
    if (status === 'approved') {
        update.approved_at = Date.now();
        update.rejected_at = null;
    } else if (status === 'rejected') {
        update.rejected_at = Date.now();
        update.approved_at = null;
    }
    return this.findByIdAndUpdate(permitId, update, { new: true });
};

// Static method: Find all permits for a bus
PermitSchema.statics.findByBus = function (busId) {
    return this.find({ bus_id: busId });
};

// Bind the schema to the specific database
const permitServiceDB = useDatabase('bus_seat_booking_service');
const Permit = permitServiceDB.model('Permit', PermitSchema);

module.exports = Permit;
