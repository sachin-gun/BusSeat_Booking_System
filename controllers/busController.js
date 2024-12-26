const Bus = require('../model/busModel');

// Get all buses

const getAllBuses = async(req, res) => {
    try {
        const buses = await Bus.find();
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a bus
const createBus = async(req, res) => {
    const { busNumber, route, seatCount, schedule ,busType,busOperatorId,status,noOfSeats,licensePlate} = req.body;
    try {
        const bus = new Bus({ busNumber, route, seatCount, schedule,busType,busOperatorId,status,noOfSeats,licensePlate });
        await bus.save();
        res.status(201).send('Bus created');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single bus by ID
const getBusById = async(req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).send('Bus not found');
        res.json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllBuses,
    createBus,
    getBusById,
}