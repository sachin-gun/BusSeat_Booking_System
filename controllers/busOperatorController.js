const BusOperator = require('..//model//busOperatorModel');
const User = require('..//model//userModel');
const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Create a new Bus Operator
 */
exports.createBusOperator = async (req, res) => {
    try {
        const { operator_name, address, email, phone_number, password } = req.body;

        // Collect validation errors
        const errors = [];

        if (!operator_name || typeof operator_name !== 'string' || operator_name.trim().length < 3) {
            errors.push('Operator name must be a valid string with at least 3 characters.');
        }
        if (!phone_number || typeof phone_number !== 'string') {
            errors.push('Phone number is required and must be a valid string.');
        }
        if (!password || typeof password !== 'string' || password.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!email || !validator.isEmail(email)) {
            errors.push('Email must be a valid string.');
        }

        // Return validation errors if any
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Check if a user with the same phone number or email already exists
        const existingUser = await User.findOne({
            $or: [{ phone_number }, { email: email || null }],
        });

        if (existingUser) {
            return res.status(400).json(
                { 
                    message: 'User with this phone number or email already exists.' ,
                    errors: [
                        'User with this phone number or email already exists.'
                    ]
                });
        }

        // Create the user
        const user = new User({
            name: operator_name.trim(),
            email: email ? email.trim() : undefined,
            phone_number: phone_number.trim(),
            password: password.trim(),
            role: 'bus_operator',
        });
        await user.save();

        // Create the bus operator
        const busOperator = new BusOperator({
            operator_name: operator_name.trim(),
            user_id: user._id,
            address: address ? address.trim() : undefined,
        });

        await busOperator.save();

        res.status(201).json({
            message: 'Bus operator and user created successfully.',
            busOperator,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error });
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
        const { operator_name, status } = req.query;

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


/**
 * Get a Bus Operator by ID
 */
exports.getBusOperatorById = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Bus Operator ID.' });
        }

        // Find the bus operator and populate the associated user
        const busOperator = await BusOperator.findById(id).populate('user_id');
        if (!busOperator) {
            return res.status(404).json({ message: 'Bus operator not found.' });
        }

        res.status(200).json({ message: 'Bus operator retrieved successfully.', busOperator });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
