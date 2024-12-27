const mongoose = require('mongoose');
const { useDatabase } = require('../config/db');

const BookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true }, // Reference to Schedule
    seat_number: { type: Number, required: true }, // Seat number reserved
    status: { 
        type: String, 
        enum: ['reserved', 'confirmed', 'canceled'], 
        default: 'reserved' 
    }, // Booking status
    payment_status: { 
        type: String, 
        enum: ['pending', 'paid', 'failed'], 
        default: 'pending' 
    }, // Payment status
    amount: { type: Number, required: true }, // Total amount for the booking
    payment_reference: { type: String, trim: true }, // Optional payment reference or transaction ID
    locked_until: { type: Date }, // Optional lock time for reservations
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware: Automatically update `updated_at` field
BookingSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Static method: Find bookings by schedule
BookingSchema.statics.findBySchedule = function (scheduleId) {
    return this.find({ schedule_id: scheduleId });
};

// Static method: Find bookings by user
BookingSchema.statics.findByUser = function (userId) {
    return this.find({ user_id: userId });
};

// Static method: Check if a seat is reserved
BookingSchema.statics.isSeatReserved = async function (scheduleId, seatNumber) {
    const booking = await this.findOne({ schedule_id: scheduleId, seat_number: seatNumber, status: { $ne: 'canceled' } });
    return !!booking;
};

const bookingServiceDB = useDatabase('bus_seat_booking_service');
const Booking = bookingServiceDB.model('Booking', BookingSchema);

module.exports = Booking;
