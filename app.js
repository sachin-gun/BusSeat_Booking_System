const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const {connectDB} = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
connectDB();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Base route
app.get('/', (req, res) => {
  res.send('Bus Ticket Booking API');
});

// API Routes
const routeRoutes = require('./routes/routeRoutes');
app.use('/api/routes', routeRoutes);

// user routes
const userRoutes = require('./routes//userRoutes');
app.use('/api', userRoutes);

const busOpertorRoutes = require('./routes//busOperatorRoutes');
app.use('/api', busOpertorRoutes);

const busRoutes = require('./routes//busRoutes');
app.use('/api/buses',busRoutes)

// Add the permit routes
const permitRoutes = require('./routes//permitRoutes');
app.use('/api/permits', permitRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
