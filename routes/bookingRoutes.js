const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/bookings', bookingController.createBooking);

// List bookings
router.get('/bookings', bookingController.listBookings);

// Update a booking
router.put('/bookings/:id', bookingController.updateBooking);

// Delete a booking
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;
