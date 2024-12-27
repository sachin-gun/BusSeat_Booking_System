const mongoose = require('mongoose');
const { useDatabase } = require('../config/db');

const PaymentSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Reference to Booking
    amount: { type: Number, required: true, min: 0 }, // Total payment amount
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'failed', 'refunded'], 
        default: 'pending' 
    }, // Payment status
    payment_method: { type: String, required: true, trim: true }, // Payment method (e.g., "credit_card", "paypal")
    transaction_reference: { type: String, required: true, unique: true, trim: true }, // Unique payment transaction reference
    metadata: { type: Object, default: {} }, // Optional additional data (e.g., provider-specific details)
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware: Automatically update `updated_at` field
PaymentSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Static method: Find payments by booking
PaymentSchema.statics.findByBooking = function (bookingId) {
    return this.find({ booking_id: bookingId });
};

// Static method: Find payments by status
PaymentSchema.statics.findByStatus = function (status) {
    return this.find({ status });
};

// Static method: Find payments by transaction reference
PaymentSchema.statics.findByTransactionReference = function (transactionReference) {
    return this.findOne({ transaction_reference: transactionReference });
};

const paymentServiceDB = useDatabase('bus_seat_booking_service');
const Payment = paymentServiceDB.model('Payment', PaymentSchema);

module.exports = Payment;
