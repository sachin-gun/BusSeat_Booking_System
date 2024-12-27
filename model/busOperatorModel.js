const mongoose = require('mongoose');
const { useDatabase } = require('../config/db'); // Import the database connection

// Define the Bus Operator Schema
const BusOperatorSchema = new mongoose.Schema({
    operator_name: { type: String, required: true, trim: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    address: { type: String, required: false }, // Optional address field
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // Operator status
    buses: [
        {
            bus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }, // Reference to the Bus model
            permit_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        }
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware: Automatically update `updated_at` field
BusOperatorSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Static method: Find operators by status
BusOperatorSchema.statics.findByStatus = function (status) {
    return this.find({ status });
};

// Static method: Approve or reject permits for a bus
BusOperatorSchema.statics.updateBusPermitStatus = async function (busId, permitStatus) {
    return this.updateOne(
        { 'buses.bus_id': busId },
        { $set: { 'buses.$.permit_status': permitStatus } }
    );
};

// Static method: Find all buses under an operator
BusOperatorSchema.statics.findBusesByOperator = function (operatorId) {
    return this.findOne({ _id: operatorId }).populate('buses.bus_id');
};


const busOperatorServiceDB = useDatabase('bus_seat_booking_service')
const BusOperator = busOperatorServiceDB.model('BusOperator', BusOperatorSchema);

module.exports = BusOperator;