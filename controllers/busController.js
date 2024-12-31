const Bus = require('../model//busModel');
const BusOperator = require('../model//busOperatorModel');
const mongoose = require('mongoose');
const User = require('../model/userModel');

/**
 * Create a new Bus
 */
exports.createBus = async (req, res) => {
    try {
        const { operatorId, bus_number, seats_count } = req.body;

        // Validate inputs
        const errors = [];
        if (!operatorId || !mongoose.Types.ObjectId.isValid(operatorId)) {
            errors.push('Operator ID must be a valid MongoDB ObjectId.');
        }
        if (!bus_number || typeof bus_number !== 'string' || bus_number.trim().length < 1) {
            errors.push('Bus number must be a valid string and cannot be empty.');
        }
        if (!seats_count || typeof seats_count !== 'number' || seats_count < 1) {
            errors.push('Seats count must be a positive number.');
        }

        // Check if operator exists
        const busOperator = await BusOperator.findOne({ user_id: operatorId })
        if (!busOperator) {
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
            operator_id: busOperator._id,
            bus_number: bus_number.trim(),
            seats_count,
        });
        await newBus.save();

        // Add the new bus to the operator's buses array
        busOperator.buses.push({
            bus_id: newBus._id,
            permit_status: newBus.permit_status,
        });
        await busOperator.save();

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
        const { search_query } = req.query;

        // Build dynamic query
        const query = {};
        
        // Check if search_query is provided
        if (search_query) {
            query.$or = [
                { operator_id: mongoose.Types.ObjectId.isValid(search_query) ? search_query : undefined }, // Matches operator_id if valid
                { bus_number: new RegExp(search_query, 'i') }, // Case-insensitive match for bus_number
                { status: new RegExp(search_query, 'i') } // Case-insensitive match for status
            ].filter(Boolean); // Remove undefined entries
        }
        

        const buses = await Bus.find(query).populate('operator_id');

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

exports.getBusById = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Bus ID.' });
        }

        // Find the bus operator and populate the associated user
        const bus = await Bus.findById(id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found.' });
        }

        res.status(200).json({ message: 'Bus retrieved successfully.', bus });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
