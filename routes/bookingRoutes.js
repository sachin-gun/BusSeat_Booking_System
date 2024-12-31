const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create a new booking
router.post('/bookings',authenticate, authorize(['customer']), bookingController.createBooking);

// List bookings
router.get('/bookings', authenticate, authorize(['customer']),bookingController.listBookings);

router.get('/bookings/:id', authenticate, authorize(['customer']), bookingController.getBookingById);

router.get('/bookings-by-user', authenticate, authorize(['customer']), bookingController.getBookingsByUser);

// Unique Points
router.get('/unique-points',authenticate,authorize(['customer']),bookingController.getUniquePoints);

router.post('/payment-intent',authenticate,authorize(['customer']),bookingController.createPaymentIntent);

// available seats
router.get('/available-seats', authenticate,authorize(['customer']),bookingController.getAvailableSeats);

// Update a booking
router.put('/bookings/:id',authenticate, authorize(['customer']), bookingController.updateBooking);

// Delete a booking
router.delete('/bookings/:id',authenticate, authorize(['customer']), bookingController.deleteBooking);

module.exports = router;
