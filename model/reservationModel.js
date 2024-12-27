const mongoose = require('mongoose');
const { reservationServiceDB } = require('../db'); // Import the reservation_serviceDB connection

const ReservationSchema = new mongoose.Schema({
    reservationId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    seatNo : {type:mongoose.Schema.Types.Number, required:true},
    paymentMethod: { type: String, enum: ['card', 'cash'], required: true },
    status: { type: String, enum: ['cancelled', 'active'], default: 'active' }
});

// Use the reservationServiceDB connection for the Reservation model
module.exports = reservationServiceDB.model('Reservation', ReservationSchema);