const mongoose = require('mongoose');
const { busServiceDB } = require('../db'); // Import the bus_serviceDB connection

const BusSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true },
    noOfSeats: { type: Number, required: true },
    busType: { type: String, enum: ['Luxury', 'Semi Luxury', 'Normal'], required: true },
    busOperatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Available', 'Maintenance', 'Unavailable'], required: true },
    permitNo: { type: String },
    permitStatus: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' }
});

// Use the busServiceDB connection for the Bus model
module.exports = busServiceDB.model('Bus', BusSchema);