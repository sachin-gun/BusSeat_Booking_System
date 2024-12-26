const mongoose = require('mongoose');
const { useDatabase } = require('..//config//db'); // Import the route_serviceDB connection

const RouteSchema = new mongoose.Schema({
    routeNo: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    avgMinutes: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
});

// Use the routeServiceDB connection for the Route model
const routeServiceDB = useDatabase('route_service')
const Route = routeServiceDB.model('Route', RouteSchema);

module.exports = Route;