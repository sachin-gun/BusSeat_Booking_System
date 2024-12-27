const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { useDatabase } = require('..//config//db'); // Import the route_serviceDB connection

// Define the User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true }, // Optional for Customers, unique constraint
    phone_number: { type: String, required: true, unique: true }, // Unique across users
    password: { type: String, required: true, minlength: 8 }, // Secure password
    role: { 
        type: String, 
        enum: ['admin', 'customer', 'bus_operator'], 
        required: true 
    },
    is_verified: { type: Boolean, default: false }, // For mobile/email verification
    tokens: [
        {
            token: { type: String, required: true }, // JWT token
            expires_at: { type: Date, required: true } // Expiration time
        }
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware: Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password is not modified
    try {
        this.password = await bcrypt.hash(this.password, 10); // Hash with salt rounds = 10
        next();
    } catch (err) {
        next(err);
    }
});

// Middleware: Hash password before updating
UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        try {
            update.password = await bcrypt.hash(update.password, 10); // Hash the updated password
        } catch (err) {
            return next(err);
        }
    }
    next();
});


// Instance method: Validate password
UserSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Instance method: Add token
UserSchema.methods.addToken = async function (token, expiryDuration = '1h') {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + (parseInt(expiryDuration) || 1));
    this.tokens.push({ token, expires_at: expiryDate });
    await this.save();
};

// Static method: Remove expired tokens
UserSchema.statics.removeExpiredTokens = async function () {
    const now = new Date();
    await this.updateMany(
        {},
        { $pull: { tokens: { expires_at: { $lt: now } } } }
    );
};

// Static method: Find user by role
UserSchema.statics.findByRole = function (role) {
    return this.find({ role });
};

const userServiceDB = useDatabase('bus_seat_booking_service')
const User = userServiceDB.model('User', UserSchema);


module.exports = User;

