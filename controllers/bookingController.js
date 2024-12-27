const Booking = require('../model//bookingModel');
const mongoose = require('mongoose');

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
