const Route = require('../model//routeModel');


const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new route
const createRoute = async (req, res) => {
    const { routeId, routeNo, from, to, avgMinutes, startTime, endTime } = req.body; // Destructure the required fields
    try {
        // Create a new Route document
        const route = new Route({ routeId, routeNo, from, to, avgMinutes, startTime, endTime });
        
        // Save to the database
        await route.save();

        res.status(201).json({ message: 'Route created successfully', route });
    } catch (err) {
        res.status(500).json({ message: `Error creating route: ${err.message}` });
    }
};

const getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).send('Route not found');
        res.json(route);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllRoutes,
    createRoute,
    getRouteById,
};
