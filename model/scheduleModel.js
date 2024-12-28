const mongoose = require('mongoose');
const { useDatabase } = require('../config/db');

const ScheduleSchema = new mongoose.Schema({
    route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true }, // Reference to Route
    bus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true }, // Reference to Bus
    start_time: { type: Date, required: true }, // Start time of the schedule
    end_time: { type: Date, required: true }, // End time of the schedule
    status: { type: String, enum: ['active', 'inactive', 'canceled', 'finished'], default: 'active' }, // Schedule status
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware: Automatically update `updated_at` field
ScheduleSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Static method: Find schedules by status
ScheduleSchema.statics.findByStatus = function (status) {
    return this.find({ status });
};

// Static method: Find schedules by route
ScheduleSchema.statics.findByRoute = function (routeId) {
    return this.find({ route_id: routeId });
};

// Static method: Find schedules for a specific bus
ScheduleSchema.statics.findByBus = function (busId) {
    return this.find({ bus_id: busId });
};

// Static method: Find schedules between times
ScheduleSchema.statics.findByTimeRange = function (start, end) {
    return this.find({
        start_time: { $gte: start },
        end_time: { $lte: end }
    });
};

// Bind the schema to the specific database
const scheduleServiceDB = useDatabase('bus_seat_booking_service');
const Schedule = scheduleServiceDB.model('Schedule', ScheduleSchema);

module.exports = Schedule;
