const express = require('express');
const router = express.Router();
const busController = require('../controllers//busController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Bus routes
router.get('/buses',authenticate, authorize(['admin','bus_operator']), busController.searchBuses);
router.post('/buses',authenticate, authorize(['admin','bus_operator']), busController.createBus);
router.put('/buses/:id',authenticate, authorize(['admin','bus_operator']), busController.updateBus);
router.delete('/buses/:id',authenticate, authorize(['admin','bus_operator']), busController.deleteBus);
router.get('/bus',authenticate, authorize(['admin','bus_operator']), busController.getBusById);

module.exports = router;
