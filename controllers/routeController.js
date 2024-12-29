const Route = require('../model/routeModel');
const mongoose = require('mongoose');

/**
 * Create a new Route
 */
exports.createRoute = async (req, res) => {
    try {
        const { route_name, start_point, end_point, distance, estimated_duration } = req.body;

        // Validation
        const errors = [];
        if (!route_name || typeof route_name !== 'string' || route_name.trim().length < 3) {
            errors.push('Route name must be a valid string with at least 3 characters.');
        }
        if (!start_point || typeof start_point !== 'string') {
            errors.push('Start point is required and must be a valid string.');
        }
        if (!end_point || typeof end_point !== 'string') {
            errors.push('End point is required and must be a valid string.');
        }
        if (!distance || typeof distance !== 'number' || distance <= 0) {
            errors.push('Distance must be a positive number.');
        }
    
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Create a new route
        const newRoute = new Route({
            route_name: route_name.trim(),
            start_point: start_point.trim(),
            end_point: end_point.trim(),
            distance,
            estimated_duration: estimated_duration ? estimated_duration.trim() : undefined,
        });

        await newRoute.save();
        res.status(201).json({ message: 'Route created successfully.', route: newRoute });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Update an Existing Route
 */
exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Route ID.' });
        }

        // Validate updates
        const errors = [];
        if (updates.route_name && (typeof updates.route_name !== 'string' || updates.route_name.trim().length < 3)) {
            errors.push('Route name must be a valid string with at least 3 characters.');
        }
        if (updates.start_point && typeof updates.start_point !== 'string') {
            errors.push('Start point must be a valid string.');
        }
        if (updates.end_point && typeof updates.end_point !== 'string') {
            errors.push('End point must be a valid string.');
        }
        if (updates.distance && (typeof updates.distance !== 'number' || updates.distance <= 0)) {
            errors.push('Distance must be a positive number.');
        }
      
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Update route
        const updatedRoute = await Route.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedRoute) {
            return res.status(404).json({ message: 'Route not found.' });
        }

        res.status(200).json({ message: 'Route updated successfully.', route: updatedRoute });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Search Routes
 */
exports.searchRoutes = async (req, res) => {
    try {
        const { search_query } = req.query;

       // Build dynamic query
       const query = {};

       if (search_query) {
           query.$or = [
               { route_name: new RegExp(search_query, 'i') }, // Case-insensitive match
               { start_point: new RegExp(search_query, 'i') },
               { end_point: new RegExp(search_query, 'i') }
           ];
       }

        // Search routes
        const routes = await Route.find(query);

        res.status(200).json({ message: 'Routes retrieved successfully.', routes });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Delete a Route
 */
exports.deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Route ID.' });
        }

        // Delete route
        const deletedRoute = await Route.findByIdAndDelete(id);
        if (!deletedRoute) {
            return res.status(404).json({ message: 'Route not found.' });
        }

        res.status(200).json({ message: 'Route deleted successfully.', route: deletedRoute });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


exports.getBusOperatorById = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Bus Operator ID.' });
        }

        // Find the bus operator and populate the associated user
        const route = await Route.findById(id);
        if (!route) {
            return res.status(404).json({ message: 'Bus operator not found.' });
        }

        res.status(200).json({ message: 'Bus operator retrieved successfully.', route });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
