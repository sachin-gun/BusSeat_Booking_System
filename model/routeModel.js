const mongoose = require('mongoose');
const { routeServiceDB, useDatabase } = require('..//config//db'); // Import the route_serviceDB connection

const RouteSchema = new mongoose.Schema({
    routeId: { type: String, required: true, unique: true },
    routeNo: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    avgMinutes: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
});

// Use the routeServiceDB connection for the Route model
const busServiceDB = useDatabase('bus_service')
const Bus = busServiceDB.model('Route', RouteSchema);

module.exports = Bus;