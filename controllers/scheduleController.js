const Schedule = require('../model//scheduleModel');
const mongoose = require('mongoose');
const Route = require('../model/routeModel');

/**
 * Create a new Schedule
 */
exports.createSchedule = async (req, res) => {
    try {
        const { route_id, bus_id, start_time, end_time, status } = req.body;

        // Validate inputs
        const errors = [];
        if (!route_id || !mongoose.Types.ObjectId.isValid(route_id)) {
            errors.push('Route ID must be a valid MongoDB ObjectId.');
        }
        if (!bus_id || !mongoose.Types.ObjectId.isValid(bus_id)) {
            errors.push('Bus ID must be a valid MongoDB ObjectId.');
        }
        if (!start_time || isNaN(Date.parse(start_time))) {
            errors.push('Start time must be a valid date.');
        }
        if (!end_time || isNaN(Date.parse(end_time))) {
            errors.push('End time must be a valid date.');
        }
        if (start_time && end_time && new Date(start_time) >= new Date(end_time)) {
            errors.push('End time must be after start time.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Create schedule
        const newSchedule = new Schedule({
            route_id,
            bus_id,
            start_time,
            end_time,
            status: status || 'active',
        });

        await newSchedule.save();
        res.status(201).json({ message: 'Schedule created successfully.', schedule: newSchedule });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * List Schedules
 */
exports.listSchedules = async (req, res) => {
    try {
        const { route_id, bus_id, status } = req.query;

        // Build dynamic query
        const query = {};
        if (route_id && mongoose.Types.ObjectId.isValid(route_id)) query.route_id = route_id;
        if (bus_id && mongoose.Types.ObjectId.isValid(bus_id)) query.bus_id = bus_id;
        if (status) query.status = status;

        const schedules = await Schedule.find(query).populate('route_id bus_id');
        res.status(200).json({ message: 'Schedules retrieved successfully.', schedules });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Update a Schedule
 */
exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Schedule ID.' });
        }

        // Validate updates
        const errors = [];
        if (updates.start_time && isNaN(Date.parse(updates.start_time))) {
            errors.push('Start time must be a valid date.');
        }
        if (updates.end_time && isNaN(Date.parse(updates.end_time))) {
            errors.push('End time must be a valid date.');
        }
        if (
            updates.start_time &&
            updates.end_time &&
            new Date(updates.start_time) >= new Date(updates.end_time)
        ) {
            errors.push('End time must be after start time.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Update schedule
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }

        res.status(200).json({ message: 'Schedule updated successfully.', schedule: updatedSchedule });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Delete a Schedule
 */
exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Schedule ID.' +id});
        }

        // Delete schedule
        const deletedSchedule = await Schedule.findByIdAndDelete(id);
        if (!deletedSchedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }

        res.status(200).json({ message: 'Schedule deleted successfully.', schedule: deletedSchedule });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


exports.getScheduleById = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Schedule ID.' });
        }

        // Find the bus operator and populate the associated user
        const schedule = await Schedule.findById(id).populate('route_id').populate('bus_id');
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }

        res.status(200).json({ message: 'Schedule retrieved successfully.', schedule });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


/**
 * Fetch active and future schedules for a specific route
 */
exports.getSchedulesByPoints = async (req, res) => {
    try {
        const { start_point, end_point } = req.query;

        // Validate input
        if (!start_point || !end_point) {
            return res.status(400).json({
                message: 'Start point and end point are required.',
            });
        }

        // Find route IDs matching the start and end points
        const routes = await Route.find({
            start_point: start_point.trim(),
            end_point: end_point.trim(),
        }).select('_id');

    

        const routeIds = routes.map((route) => route._id);

        // Fetch active and future schedules for the routes
        const now = new Date();
        const schedules = await Schedule.find({
            route_id: { $in: routeIds },
            start_time: { $gte: now }, // Future schedules
            status: { $in: ['active', 'inactive'] }, // Active or inactive
        })
            .populate('route_id', 'route_name start_point end_point') // Include route details
            .populate('bus_id', 'bus_number seats_count status') // Include bus details
            .sort({ start_time: 1 });

        res.status(200).json({
            message: 'Schedules retrieved successfully.',
            schedules,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error.',
            error: error.message,
        });
    }
};

