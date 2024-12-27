const mongoose = require('mongoose');
const { tripServiceDB } = require('../db'); // Import the trip_serviceDB connection

const TripSchema = new mongoose.Schema({
    tripId: { type: String, required: true, unique: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    seatsAvailable: { type: Number, required: true },
    ticketPrice: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
});

// Use the tripServiceDB connection for the Trip model
module.exports = tripServiceDB.model('Trip', TripSchema);