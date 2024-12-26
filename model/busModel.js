const mongoose = require('mongoose');
const { useDatabase } = require('..//config//db'); // Import the bus_serviceDB connection


const BusSchema = new mongoose.Schema({
    licensePlate: { type: String, required: true, unique: true },
    noOfSeats: { type: Number, required: true },
    busType: { type: String, enum: ['luxury', 'semi_luxury', 'normal'], required: true },
    busOperatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['available', 'maintenance', 'unavailable'], required: true },
    permitNo: { type: String },
    permitStatus: { type: String, enum: ['pending', 'approved'], default: 'pending' }
});

// Use the busServiceDB connection for the Bus model
const busServiceDB = useDatabase('bus_service')
const Bus = busServiceDB.model('Bus', BusSchema);

module.exports = Bus;


