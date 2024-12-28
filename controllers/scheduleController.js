const Schedule = require('../model//scheduleModel');
const mongoose = require('mongoose');

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
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Schedule ID.' });
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
