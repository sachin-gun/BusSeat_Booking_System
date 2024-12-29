const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Search routes
router.get('/routes', routeController.searchRoutes);

// Create a new route
router.post('/routes', routeController.createRoute);

// Update an existing route
router.put('/routes/:id', routeController.updateRoute);

// Delete a route
router.delete('/routes/:id', routeController.deleteRoute);

// list
router.get('/route', routeController.getBusOperatorById);

module.exports = router;
