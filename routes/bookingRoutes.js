const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create a new booking
router.post('/bookings',authenticate, authorize(['customer']), bookingController.createBooking);

// List bookings
router.get('/bookings', authenticate, authorize(['customer']),bookingController.listBookings);

// Update a booking
router.put('/bookings/:id',authenticate, authorize(['customer']), bookingController.updateBooking);

// Delete a booking
router.delete('/bookings/:id',authenticate, authorize(['customer']), bookingController.deleteBooking);

module.exports = router;
