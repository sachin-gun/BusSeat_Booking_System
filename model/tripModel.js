const mongoose = require('mongoose');
const { tripServiceDB } = require('../db'); // Import the trip_serviceDB connection

const TripSchema = new mongoose.Schema({
    tripId: { type: String, required: true, unique: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    routeNo: { type: String, required: true },
    licensePlate: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    seatsAvailable: { type: Number, required: true },
    ticketPrice: { type: Number, required: true }
});

// Use the tripServiceDB connection for the Trip model
module.exports = tripServiceDB.model('Trip', TripSchema);