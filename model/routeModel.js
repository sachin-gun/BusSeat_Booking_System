const mongoose = require('mongoose');
const { useDatabase } = require('../config/db');

const RouteSchema = new mongoose.Schema({
    route_name: { type: String, required: true, trim: true }, // Human-readable route name
    start_point: { type: String, required: true, trim: true }, // Starting location
    end_point: { type: String, required: true, trim: true }, // Ending location
    distance: { type: Number, required: true, min: 0 }, // Total distance of the route (in km or miles)
    estimated_duration: { type: String, required: false, trim: true }, // Estimated travel time (e.g., "2 hours")
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // Route status
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware: Automatically update `updated_at` field
RouteSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Static method: Find routes by status
RouteSchema.statics.findByStatus = function (status) {
    return this.find({ status });
};

const routeServiceDB = useDatabase('bus_seat_booking_service');
const Route = routeServiceDB.model('Route', RouteSchema);

module.exports = Route;
