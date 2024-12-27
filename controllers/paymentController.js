const Payment = require('../model/paymentModel');
const mongoose = require('mongoose');

/**
 * Create a Payment
 */
exports.createPayment = async (req, res) => {
    try {
        const { booking_id, amount, payment_method, transaction_reference, metadata } = req.body;

        // Validate inputs
        const errors = [];
        if (!booking_id || !mongoose.Types.ObjectId.isValid(booking_id)) {
            errors.push('Booking ID must be a valid MongoDB ObjectId.');
        }
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            errors.push('Amount must be a valid positive number.');
        }
        if (!payment_method || typeof payment_method !== 'string') {
            errors.push('Payment method is required and must be a string.');
        }
        if (!transaction_reference || typeof transaction_reference !== 'string') {
            errors.push('Transaction reference is required and must be a string.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Check for duplicate transaction reference
        const existingPayment = await Payment.findByTransactionReference(transaction_reference);
        if (existingPayment) {
            return res.status(400).json({ message: 'Transaction reference already exists.' , error : [
                "Transaction reference already exists."
            ] });
        }

        // Create the payment
        const newPayment = new Payment({
            booking_id,
            amount,
            payment_method,
            transaction_reference,
            metadata,
        });

        await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully.', payment: newPayment });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Search Payments
 */
exports.searchPayments = async (req, res) => {
    try {
        const { booking_id, status, transaction_reference } = req.query;

        // Build dynamic query
        const query = {};
        if (booking_id && mongoose.Types.ObjectId.isValid(booking_id)) query.booking_id = booking_id;
        if (status) query.status = status;
        if (transaction_reference) query.transaction_reference = transaction_reference;

        const payments = await Payment.find(query);
        if (payments.length === 0) {
            return res.status(404).json({ message: 'No payments found.', data: [] });
        }

        res.status(200).json({ message: 'Payments retrieved successfully.', payments });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Update a Payment
 */
exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;


        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Payment ID.' });
        }

        // Validate updates
        const errors = [];
        if (updates.amount && (typeof updates.amount !== 'number' || updates.amount <= 0)) {
            errors.push('Amount must be a valid positive number.');
        }
        if (updates.status && !['pending', 'paid', 'failed', 'refunded'].includes(updates.status)) {
            errors.push('Invalid payment status.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation errors.', errors });
        }

        // Update payment
        const updatedPayment = await Payment.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found.' ,errors: [
                'Payment not found.'
            ] });
        }

        res.status(200).json({ message: 'Payment updated successfully.', payment: updatedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

/**
 * Delete a Payment
 */
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Payment ID.' });
        }

        // Delete payment
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        res.status(200).json({ message: 'Payment deleted successfully.', payment: deletedPayment });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
