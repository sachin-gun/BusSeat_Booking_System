const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bus Reservation System API',
      version: '1.0.0',
      description: 'API documentation for the Bus Reservation System',
    },
    servers: [
      {
        url: 'http://127.0.0.1:5000/api', // Base URL of your API
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // Include the paths to your routes and models
};

// Generate Swagger documentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
