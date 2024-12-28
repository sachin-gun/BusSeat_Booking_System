const express = require('express');
const router = express.Router();
const busOperatorController = require('../controllers/busOperatorController');

// Bus Operator routes
router.get('/bus-operators', busOperatorController.searchBusOperators);
router.post('/bus-operators', busOperatorController.createBusOperator);
router.put('/bus-operators/:id', busOperatorController.updateBusOperator);
router.delete('/bus-operators/:id', busOperatorController.deleteBusOperator);

module.exports = router;
