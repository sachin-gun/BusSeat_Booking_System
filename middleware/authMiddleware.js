const jwt = require('jsonwebtoken');
const User = require('../model/userModel'); // Adjust the path if necessary

const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret or use process.env.JWT_SECRET

/**
 * Authenticate the user by verifying the JWT token.
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication token is missing or invalid.',
                error: ['Missing or malformed token.'],
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user details to the request
        req.user = decoded;

        // Optionally, verify user still exists in DB
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed.',
                error: ['User not found.'],
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed.',
            error: [error.message],
        });
    }
};

/**
 * Authorize the user based on their role.
 * @param {Array} roles - Array of allowed roles.
 */
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to access this resource.',
                error: ['Insufficient permissions.'],
            });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
