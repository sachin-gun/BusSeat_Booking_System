const express = require('express');
const router = express.Router();
const busOperatorController = require('../controllers/busOperatorController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Bus Operator routes
router.get('/bus-operators',authenticate, authorize(['admin']), busOperatorController.searchBusOperators);
router.get('/bus-operator', authenticate, authorize(['admin']),busOperatorController.getBusOperatorById);
router.post('/bus-operators', authenticate, authorize(['admin']),busOperatorController.createBusOperator);
router.put('/bus-operators/:id', authenticate, authorize(['admin']),busOperatorController.updateBusOperator);
router.delete('/bus-operators/:id', authenticate, authorize(['admin']) ,busOperatorController.deleteBusOperator);

module.exports = router;
