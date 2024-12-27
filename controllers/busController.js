const Bus = require('../model//busModel');
const BusOperator = require('../model//busOperatorModel');
const mongoose = require('mongoose');

/**
 * Create a new Bus
 */
exports.createBus = async (req, res) => {
    try {
        const { operator_id, bus_number, seats_count } = req.body;

        // Validate inputs
        const errors = [];
        if (!operator_id || !mongoose.Types.ObjectId.isValid(operator_id)) {
            errors.push('Operator ID must be a valid MongoDB ObjectId.');
        }
        if (!bus_number || typeof bus_number !== 'string' || bus_number.trim().length < 1) {
            errors.push('Bus number must be a valid string and cannot be empty.');
        }
        if (!seats_count || typeof seats_count !== 'number' || seats_count < 1) {
            errors.push('Seats count must be a positive number.');
        }

        // Check if operator exists
        const operator = await BusOperator.findById(operator_id);
        if (!operator) {
            errors.push('Operator not found.');
        }

        // Check if bus number is unique
        const existingBus = await Bus.findOne({ bus_number });
        if (existingBus) {
            errors.push('Bus number is already in use.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Create new bus
        const newBus = new Bus({
            operator_id,
            bus_number: bus_number.trim(),
            seats_count,
        });
        await newBus.save();

        // Add the new bus to the operator's buses array
        operator.buses.push({
            bus_id: newBus._id,
            permit_status: newBus.permit_status,
        });
        await operator.save();

        res.status(201).json({ message: 'Bus created successfully.', bus: newBus });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Update an existing Bus
 */
exports.updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Bus ID.' });
        }

        // Validate inputs
        const errors = [];
        if (updates.bus_number && (typeof updates.bus_number !== 'string' || updates.bus_number.trim().length < 1)) {
            errors.push('Bus number must be a valid string and cannot be empty.');
        }
        if (updates.seats_count && (typeof updates.seats_count !== 'number' || updates.seats_count < 1)) {
            errors.push('Seats count must be a positive number.');
        }
        if (updates.status && !['active', 'inactive', 'under_maintenance'].includes(updates.status)) {
            errors.push('Status must be one of: active, inactive, under_maintenance.');
        }
    
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Update bus
        const updatedBus = await Bus.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedBus) {
            return res.status(404).json({ message: 'Bus not found.' });
        }

        res.status(200).json({ message: 'Bus updated successfully.', bus: updatedBus });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Search for Buses
 */
exports.searchBuses = async (req, res) => {
    try {
        const { operator_id, bus_number, status } = req.body;

        // Build dynamic query
        const query = {};
        if (operator_id && mongoose.Types.ObjectId.isValid(operator_id)) {
            query.operator_id = operator_id;
        }
        if (bus_number) {
            query.bus_number = new RegExp(bus_number, 'i'); // Case-insensitive match
        }
        if (status) {
            query.status = status;
        }

        const buses = await Bus.find(query).populate('operator_id');
        if (buses.length === 0) {
            return res.status(404).json({ message: 'No buses found.', data: [] });
        }

        res.status(200).json({ message: 'Buses retrieved successfully.', buses });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Delete a Bus
 */
exports.deleteBus = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Bus ID.' });
        }

        // Delete bus
        const deletedBus = await Bus.findByIdAndDelete(id);
        if (!deletedBus) {
            return res.status(404).json({ message: 'Bus not found.' });
        }

        res.status(200).json({ message: 'Bus deleted successfully.', bus: deletedBus });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
