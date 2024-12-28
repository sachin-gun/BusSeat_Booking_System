const express = require('express');
const router = express.Router();
const busController = require('../controllers//busController');

// Bus routes
router.get('/buses', busController.searchBuses);
router.post('/buses', busController.createBus);
router.put('/buses/:id', busController.updateBus);
router.delete('/buses/:id', busController.deleteBus);

module.exports = router;
