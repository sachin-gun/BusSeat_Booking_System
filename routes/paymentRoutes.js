const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new payment
router.post('/payments', paymentController.createPayment);

// Search payments
router.get('/payments', paymentController.searchPayments);

// Update a payment
router.put('/payments/:id', paymentController.updatePayment);


module.exports = router;
