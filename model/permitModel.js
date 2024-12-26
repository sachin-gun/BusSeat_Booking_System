const mongoose = require('mongoose');
const { useDatabase } = require('..//config//db'); // Import the bus_serviceDB connection
const Bus = require('./busModel');
const Route = require('./routeModel');

const PermitSchema = new mongoose.Schema({
    permitId: { type: String, unique: true},
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    permitRegisteredDate: { type: Date, default: Date.now },
    validThrough: { type: Date },
    status: { type: String, enum: ['pending', 'approved','rejected'], default: 'pending' }
});

// Pre-save hook to generate permitId if not provided
PermitSchema.pre('save', async function (next) {
    if (!this.permitId) {
        try {
            // Retrieve bus and route details
            const bus = await Bus.findById(this.busId);
            const route = await Route.findById(this.routeId);

            if (bus && route) {
                this.permitId = `PERMIT-${bus.licensePlate}-${route.routeNo}-${Date.now()}`;
            } else {
                throw new Error('Bus or Route details not found');
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});


// Use the busServiceDB connection for the Bus model
const permitServiceDB = useDatabase('permit_service')
const Permit = permitServiceDB.model('Permit', PermitSchema);

module.exports = Permit;


