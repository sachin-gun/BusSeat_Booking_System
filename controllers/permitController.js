const Permit = require('../model//permitModel');
const Bus = require('../model/busModel');
const Route = require('../model/routeModel'); // Assuming you have a Route model

// Get all permits
const getAllPermits = async (req, res) => {
    try {
        // Retrieve all permits with related bus and route data populated
        const permits = await Permit.find()
             .populate('busId', 'licensePlate noOfSeats busType') // Populate bus details
            // .populate('routeId', 'routeNo from to'); // Populate route details
        res.json(permits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a permit
const createPermit = async (req, res) => {
    const { busId, routeId, validThrough, status } = req.body;

    try {
        // Validate related Bus and Route existence
        const bus = await Bus.findById(busId);
        const route = await Route.findById(routeId);

        if (!bus) return res.status(400).json({ message: 'Bus not found' });
        if (!route) return res.status(400).json({ message: 'Route not found' });

        // Create a new permit
        const permit = new Permit({ busId, routeId, validThrough, status });
        await permit.save();

        res.status(201).json({ message: 'Permit created successfully', permit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single permit by ID
const getPermitById = async (req, res) => {
    try {
        const permit = await Permit.findById(req.params.id)
            // .populate('busId', 'licensePlate noOfSeats busType') // Populate bus details
            // .populate('routeId', 'routeNo from to'); // Populate route details

        if (!permit) return res.status(404).json({ message: 'Permit not found' });
        res.json(permit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllPermits,
    createPermit,
    getPermitById,
};
