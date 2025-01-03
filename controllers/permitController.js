const Permit = require('../model//permitModel');
const Bus = require('../model/busModel');
const mongoose = require('mongoose');
const Route = require("../model/routeModel");

/**
 * Search Permits
 */
exports.searchPermits = async (req, res) => {
    try {
        const { route_id, bus_id, operator_id, permit_status } = req.body;

        // Build dynamic query
        const query = {};
        if (bus_id) query.bus_id = bus_id;
        if (route_id) query.route_id = route_id;
        if (operator_id) query.operator_id = operator_id;
        if (permit_status) query.permit_status = permit_status;

        // Fetch permits based on query
        const permits = await Permit.find(query).populate('bus_id operator_id');
        if (permits.length === 0) {
            return res.status(404).json({ message: 'No permits found.', data: [] });
        }

        res.status(200).json({ message: 'Permits retrieved successfully.', permits });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


/**
 * Create a new Permit
 */
exports.createPermit = async (req, res) => {
    try {
        const { bus_id, operator_id, comments,route_id } = req.body;

        // Validate inputs
        const errors = [];
        if (!bus_id || !mongoose.Types.ObjectId.isValid(bus_id)) {
            errors.push('Bus ID must be a valid MongoDB ObjectId.');
        }
        if (!operator_id || !mongoose.Types.ObjectId.isValid(operator_id)) {
            errors.push('Operator ID must be a valid MongoDB ObjectId.');
        }
        if (!route_id || !mongoose.Types.ObjectId.isValid(route_id)) {
            errors.push('Route ID must be a valid MongoDB ObjectId.');
        }

        const bus = await Bus.findById(bus_id);
        if (!bus) {
            errors.push('Bus not found.');
        } else if (bus.operator_id.toString() !== operator_id) {
            errors.push('Bus does not belong to the specified operator.');
        }

        const route = await Route.findById(route_id);
        if (!route) {
            errors.push('Route not found.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Create permit
        const newPermit = new Permit({
            bus_id,
            operator_id,
            route_id,
            comments,
        });
        await newPermit.save();

        res.status(201).json({ message: 'Permit created successfully.', permit: newPermit });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// Get a single permit by ID
/**
 * Update Permit Status
 */
exports.updatePermitStatus = async (req, res) => {
    try {
        const { id } = req.params; // Permit ID
        const { permit_status, comments } = req.body;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(permit_status)) {
            return res.status(400).json({ message: 'Invalid permit status.' });
        }

         // Find the permit to update
         const permit = await Permit.findById(id);
         if (!permit) {
             return res.status(404).json({ message: 'Permit not found.' });
         }
 
         // Check for existing active permit for the same bus
         if (permit_status === 'approved') {
             const existingApprovedPermit = await Permit.findOne({
                 bus_id: permit.bus_id,
                 permit_status: 'approved',
                 _id: { $ne: id } // Exclude the current permit
             });
 
             if (existingApprovedPermit) {
                 return res.status(400).json({
                     message: 'Another active permit already exists for this bus.',
                     error : [
                        
                     ] 
                 });
             }
         }

         // Update permit status
         permit.permit_status = permit_status;
         permit.comments = comments || permit.comments;
         if (permit_status === 'approved') {
             permit.approved_at = Date.now();
             permit.rejected_at = null;
         } else if (permit_status === 'rejected') {
             permit.rejected_at = Date.now();
             permit.approved_at = null;
         }
 
        await permit.save();
 
        if (!permit) {
            return res.status(404).json({ message: 'Permit not found.',error : [] });
        }

        res.status(200).json({ message: 'Permit status updated successfully.', permit });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

exports.getPermitById = async (req, res) => {
    try {
        const { id } = req.query;
        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Permit ID.' });
        }

        // Find the Permit 
        const permit = await Permit.findById(id)
            .populate({
                path: 'bus_id',
                select: 'bus_number seats_count status', 
            })
            .populate({
                path: 'route_id',
                select: 'route_name start_point end_point distance status', 
            });

        if (!permit) {
            return res.status(404).json({ message: 'Permit not found.' });
        }

        res.status(200).json({ message: 'Permit retrieved successfully.', permit });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


/**
 * Delete a Permit
 */
exports.deletePermit = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Permit ID.' +id});
        }

        // Delete schedule
        const deletedPermited = await Permit.findByIdAndDelete(id);
        if (!deletedPermited) {
            return res.status(404).json({ message: 'Permit not found.' });
        }

        res.status(200).json({ message: 'Permit deleted successfully.', permit: deletedPermited });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};