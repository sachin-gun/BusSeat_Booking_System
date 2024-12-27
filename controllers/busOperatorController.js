const BusOperator = require('..//model//busOperatorModel');
const User = require('..//model//userModel');
const mongoose = require('mongoose');

/**
 * Create a new Bus Operator
 */
exports.createBusOperator = async (req, res) => {
    try {
        const { operator_name, user_id, address } = req.body;

        // Collect validation errors
        const errors = [];

        if (!operator_name || typeof operator_name !== 'string' || operator_name.trim().length < 3) {
            errors.push('Operator name must be a valid string with at least 3 characters.');
        }

        if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
            errors.push('User ID must be a valid MongoDB ObjectId.');
        }

        if (address && typeof address !== 'string') {
            errors.push('Address must be a valid string.');
        }

        // Check for user existence and role if user_id is valid
        if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
            const user = await User.findById(user_id);
            if (!user) {
                errors.push('User ID does not exist.');
            } else if (user.role !== 'bus_operator') {
                errors.push('User is not authorized as a bus operator.');
            }
        }

        // Check for user existence and role if user_id is valid
        if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
            const user = await User.findById(user_id);
            if (!user) {
                errors.push('User ID does not exist.');
            } else if (user.role !== 'bus_operator') {
                errors.push('User is not authorized as a bus operator.');
            }

            // Check if user_id is already associated with another bus operator
            const existingOperator = await BusOperator.findOne({ user_id });
            if (existingOperator) {
                errors.push('This user ID is already associated with another bus operator.');
            }
        }

    

        // Return all validation errors at once
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        

        // Create new Bus Operator
        const busOperator = new BusOperator({
            operator_name: operator_name.trim(),
            user_id,
            address: address ? address.trim() : undefined
        });
        await busOperator.save();

        res.status(201).json({ message: 'Bus operator created successfully.', busOperator });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Update an existing Bus Operator
 */
exports.updateBusOperator = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Collect validation errors
        const errors = [];

        // Validate Bus Operator ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            errors.push('Invalid Bus Operator ID.');
        }

        // Validate operator_name
        if (updates.operator_name && (typeof updates.operator_name !== 'string' || updates.operator_name.trim().length < 3)) {
            errors.push('Operator name must be a valid string with at least 3 characters.');
        }

        // Validate address
        if (updates.address && typeof updates.address !== 'string') {
            errors.push('Address must be a valid string.');
        }

        // Validate status
        if (updates.status && !['active', 'inactive'].includes(updates.status)) {
            errors.push('Status must be either "active" or "inactive".');
        }

        // Return all validation errors at once
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Update Bus Operator
        const busOperator = await BusOperator.findByIdAndUpdate(id, updates, { new: true });
        if (!busOperator) {
            return res.status(404).json({ message: 'Bus operator not found.' });
        }

        res.status(200).json({ message: 'Bus operator updated successfully.', busOperator });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Search for Bus Operators
 */
exports.searchBusOperators = async (req, res) => {
    try {
        const { operator_name, status } = req.body;

        // Build dynamic query
        const query = {};
        if (operator_name) query.operator_name = new RegExp(operator_name, 'i'); // Case-insensitive search
        if (status) query.status = status;

        const busOperators = await BusOperator.find(query).populate('user_id');
        if (busOperators.length === 0) {
            return res.status(404).json({ message: 'No bus operators found.',data: [] });
        }

        res.status(200).json({ busOperators });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Delete a Bus Operator
 */
exports.deleteBusOperator = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete Bus Operator
        const busOperator = await BusOperator.findByIdAndDelete(id);
        if (!busOperator) {
            return res.status(404).json({ message: 'Bus operator not found.' });
        }

        res.status(200).json({ message: 'Bus operator deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
