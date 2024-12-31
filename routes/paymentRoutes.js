const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create a new payment
router.post('/payments',authenticate, authorize(['customer']), paymentController.createPayment);

// Search payments
router.get('/payments', authenticate, authorize(['customer']),paymentController.searchPayments);

// Update a payment
router.put('/payments/:id', authenticate, authorize(['customer']),paymentController.updatePayment);


module.exports = router;
