const Booking = require('../model//bookingModel');
const mongoose = require('mongoose');
const Schedule = require('../model/scheduleModel');
/**
 * Create a Booking
 */
exports.createBooking = async (req, res) => {
    try {
        const { user_id, schedule_id, seat_number, amount } = req.body;

        // Validate inputs
        const errors = [];
        if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
            errors.push('User ID must be a valid MongoDB ObjectId.');
        }
        if (!schedule_id || !mongoose.Types.ObjectId.isValid(schedule_id)) {
            errors.push('Schedule ID must be a valid MongoDB ObjectId.');
        }
        if (!seat_number || typeof seat_number !== 'number' || seat_number <= 0) {
            errors.push('Seat number must be a valid positive integer.');
        }
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            errors.push('Amount must be a valid positive number.');
        }

        // Check if seat is already reserved
        const isReserved = await Booking.isSeatReserved(schedule_id, seat_number);
        if (isReserved) {
            errors.push(`Seat number ${seat_number} is already reserved for the selected schedule.`);
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Create the booking
        const newBooking = new Booking({
            user_id,
            schedule_id,
            seat_number,
            amount,
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully.', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * List Bookings
 */
exports.listBookings = async (req, res) => {
    try {
        const { user_id, schedule_id, status } = req.query;

        // Build dynamic query
        const query = {};
        if (user_id && mongoose.Types.ObjectId.isValid(user_id)) query.user_id = user_id;
        if (schedule_id && mongoose.Types.ObjectId.isValid(schedule_id)) query.schedule_id = schedule_id;
        if (status) query.status = status;

        const bookings = await Booking.find(query).populate('user_id schedule_id');
        res.status(200).json({ message: 'Bookings retrieved successfully.', bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Update a Booking
 */
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Booking ID.' });
        }

        // Validate updates
        const errors = [];
        if (updates.seat_number && (typeof updates.seat_number !== 'number' || updates.seat_number <= 0)) {
            errors.push('Seat number must be a valid positive integer.');
        }
        if (updates.amount && (typeof updates.amount !== 'number' || updates.amount <= 0)) {
            errors.push('Amount must be a valid positive number.');
        }
        if (updates.status && !['reserved', 'confirmed', 'canceled'].includes(updates.status)) {
            errors.push('Invalid booking status.');
        }
        if (updates.payment_status && !['pending', 'paid', 'failed'].includes(updates.payment_status)) {
            errors.push('Invalid payment status.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Update booking
        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({ message: 'Booking updated successfully.', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Delete a Booking
 */
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Booking ID.' });
        }

        // Delete booking
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({ message: 'Booking deleted successfully.', booking: deletedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};


const Route = require('../model/routeModel');

/**
 * Get all unique start and end points in a single array
 */
exports.getUniquePoints = async (req, res) => {
    try {
        // Combine start_point and end_point into a single array
        const uniquePoints = await Route.aggregate([
            {
                $project: {
                    points: {
                        $setUnion: [["$start_point"], ["$end_point"]], // Combine start_point and end_point
                    },
                },
            },
            {
                $unwind: "$points", // Flatten the points array
            },
            {
                $group: {
                    _id: null,
                    uniquePoints: { $addToSet: "$points" }, // Deduplicate points
                },
            },
            {
                $project: { _id: 0, points: "$uniquePoints" }, // Final output format
            },
        ]);

        res.status(200).json({
            message: "Unique points retrieved successfully.",
            data: uniquePoints[0]?.points || [],
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error.",
            error: error.message,
        });
    }
};

const stripe = require('stripe')('sk_test_51QbpVd08WMagMX2E2HgtcaGNCqVDvmSoUXSgQhsfrUBcG4KUFCWaVUcJIZx29oQBje6iW1sMePHXnNaRyh0CvfL800lfnfBEJ8'); // Replace with your Stripe secret key

/**
 * Create a payment intent
 */
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount.' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to smallest currency unit
            currency: currency || 'usd',
        });

        res.status(200).json({
            message: 'Payment intent created successfully.',
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error.',
            error: error.message,
        });
    }
};


/**
 * Get available seats for a schedule
 */
exports.getAvailableSeats = async (req, res) => {
    try {
        const { schedule_id } = req.query;

        // Validate input
        if (!schedule_id) {
            return res.status(400).json({
                message: 'Schedule ID is required.',
            });
        }

        // Fetch the schedule and populate the bus details
        const schedule = await Schedule.findById(schedule_id).populate('bus_id');
        if (!schedule) {
            return res.status(404).json({
                message: 'Schedule not found.',
            });
        }

        const bus = schedule.bus_id;
        if (!bus) {
            return res.status(404).json({
                message: 'Bus not found for the given schedule.',
            });
        }

        // Get all booked seats for the schedule
        const bookings = await Booking.find({
            schedule_id,
            status: { $in: ['reserved', 'confirmed'] }, // Include only reserved or confirmed bookings
        });

        const bookedSeats = bookings.map((booking) => booking.seat_number);

        // Calculate available seats
        const totalSeats = Array.from({ length: bus.seats_count }, (_, i) => i + 1); // All seat numbers (1 to seats_count)
        const availableSeats = totalSeats.filter((seat) => !bookedSeats.includes(seat));

        res.status(200).json({
            message: 'Available seats retrieved successfully.',
            data: {
                totalSeats: bus.seats_count,
                bookedSeats,
                availableSeats,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error.',
            error: error.message,
        });
    }
};


/**
 * Get a booking by ID with schedule details
 */
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params; // Booking ID from URL params

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Booking ID.' });
        }

        // Find the booking and populate schedule and user data
        const booking = await Booking.findById(id)
            .populate({
                path: 'schedule_id',
                populate: {
                    path: 'route_id bus_id', // Populate route and bus inside schedule
                },
            })
            .populate('user_id'); // Populate user details

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({
            message: 'Booking retrieved successfully.',
            booking,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error.',
            error: error.message,
        });
    }
};


/**
 * Get bookings by user ID
 */
exports.getBookingsByUser = async (req, res) => {
    try {
        const { user_id } = req.query;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: 'Invalid User ID.' });
        }

        // Find bookings for the user and populate schedule and user details
        const bookings = await Booking.find({ user_id })
            .populate({
                path: 'schedule_id',
                populate: {
                    path: 'route_id bus_id', // Populate route and bus inside schedule
                },
            })
            .populate('user_id'); // Populate user details

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for the user.' });
        }

        res.status(200).json({
            message: 'Bookings retrieved successfully.',
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error.',
            error: error.message,
        });
    }
};
