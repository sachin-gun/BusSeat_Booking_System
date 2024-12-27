const mongoose = require('mongoose');
const { useDatabase } = require('..//config//db'); // Import the bus_serviceDB connection


const BusSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true },
    noOfSeats: { type: Number, required: true },
    busType: { type: String, enum: ['luxury', 'semi_luxury', 'normal'], required: true },
    busOperatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['available', 'maintenance', 'unavailable'], default: 'available' },
    permitNo: { type: String },
    permitStatus: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    availableSeats: { type: [Number], default: [] }, // Array to store available seat numbers
});

// Automatically initialize availableSeats based on noOfSeats
BusSchema.pre('save', function (next) {
    if (this.isNew) {
        this.availableSeats = Array.from({ length: this.noOfSeats }, (_, i) => i + 1); // Generate seat numbers 1 to noOfSeats
    }
    next();
});


// Use the busServiceDB connection for the Bus model
const busServiceDB = useDatabase('bus_service')
const Bus = busServiceDB.model('Bus', BusSchema);

module.exports = Bus;


