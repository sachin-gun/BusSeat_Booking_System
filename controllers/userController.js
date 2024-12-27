
const User = require('..//model//userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const validator = require('validator');

// Secret for JWT token
const JWT_SECRET = 'your_jwt_secret'; 

/**
 * Create a new user
 */
exports.createUser = async (req, res) => {
    try {
        const { name, email, phone_number, password, role } = req.body;

        // Unified Validation
        const errors = [];

        if (!name || typeof name !== 'string' || name.trim().length < 3) {
            errors.push('Name must be a valid string with at least 3 characters.');
        }

        if (!email || !validator.isEmail(email)) {
            errors.push('Invalid email address.');
        }

        if (!phone_number || !validator.isMobilePhone(phone_number, 'any')) {
            errors.push('Invalid phone number.');
        }

        if (
            !password ||
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {
            errors.push(
                'Password must be at least 8 characters long, include an uppercase letter and a number.'
            );
        }

        if (!role || !['admin', 'customer', 'bus_operator'].includes(role)) {
            errors.push('Role must be one of Admin, Customer, or Bus Operator.');
        }

        // Return errors if validation fails
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone_number });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'System Error' ,error: [
                    "User already exists with this phone number."
                ]});
        }

        // Create user
        const user = new User({
            name: name.trim(),
            email,
            phone_number,
            password,
            role,
        });
        await user.save();

        res.status(201).json({ message: 'User created successfully.', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error });
    }
};

/**
 * Update an existing user
 */
exports.updateUser = async (req, res) => {
    try {       
        const { id } = req.params;

        const { name, email, phone_number, password, role } = req.body;

        // Unified Validation
        const errors = [];

        if (!name || typeof name !== 'string' || name.trim().length < 3) {
            errors.push('Name must be a valid string with at least 3 characters.');
        }

        // if (!email || !validator.isEmail(email)) {
        //     errors.push('Invalid email address.');
        // }

        // if (!phone_number || !validator.isMobilePhone(phone_number, 'any')) {
        //     errors.push('Invalid phone number.');
        // }

        // if (
        //     !password ||
        //     password.length < 8 ||
        //     !/[A-Z]/.test(password) ||
        //     !/[0-9]/.test(password)
        // ) {
        //     errors.push(
        //         'Password must be at least 8 characters long, include an uppercase letter and a number.'
        //     );
        // }

        if (!role || !['admin', 'customer', 'bus_operator'].includes(role)) {
            errors.push('Role must be one of Admin, Customer, or Bus Operator.');
        }

        // Return errors if validation fails
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Check if user already exists
        if (phone_number) {
            const existingUser = await User.findOne({ phone_number: phone_number });
            if (existingUser && existingUser._id.toString() !== id) {
                return res
                    .status(400)
                    .json({ message: 'System Error.' ,error: [
                        "Phone number is already in use by another user"
                    ]});
            }
        }

        // Update user
        const user = await User.findByIdAndUpdate(id, {name, role}, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'System Error' ,error: [
                "User not found."
            ]});
        }

        res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Update password an existing user
 */
exports.updateUserPassword = async (req, res) => {
    try {       
        const { id } = req.params;

        const {  password } = req.body;

        // Unified Validation
        const errors = [];

        if (
            !password ||
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {
            errors.push(
                'Password must be at least 8 characters long, include an uppercase letter and a number.'
            );
        }

        // Return errors if validation fails
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Update user
        const user = await User.findByIdAndUpdate(id, {password}, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'System Error' ,error: [
                "User not found."
            ]});
        }

        res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


/**
 * Search for users
 */
exports.searchUsers = async (req, res) => {
    try {
        const { role, search_query } = req.body;

        // Build dynamic query
        const query = {};

        if (role) query.role = role;

        // Add $or condition for phone_number and name if search_query is provided
        if (search_query) {
            query.$or = [
                { phone_number: new RegExp(search_query, 'i') }, // Partial match for phone_number
                { name: new RegExp(search_query, 'i') } // Partial match for name
            ];
        }

        // Execute query
        const users = await User.find(query);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Not Found', error: [ "No users found matching the search criteria."] });
        }


        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Delete a user
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete user
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'System Error', error: [
                'User not found.'
            ] });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Check password for login
 */
exports.login = async (req, res) => {
    try {
        const { phone_number, password } = req.body;

        // Validate input
        if (!phone_number || !password) {
            return res.status(400).json({ message: 'Missing required fields.' , error : [
                "Phone number or password is missing"
            ] });
        }

        // Find user
        const user = await User.findOne({ phone_number });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check password
        const isPasswordValid = await user.isValidPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // Add token to user
        await user.addToken(token, '1h');

        res.status(200).json({ message: 'Login successful.', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
