const express = require('express');
const { getAllBuses, createBus, getBusById } = require('../controllers/busController');
const router = express.Router();

/**
 * @swagger
 * /buses:
 *   get:
 *     summary: Retrieve all buses
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: List of all buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bus'
 */
router.get('/', getAllBuses);

/**
/**
 * @swagger
 * /buses:
 *   post:
 *     summary: Create a new bus
 *     tags: [Buses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licensePlate:
 *                 type: string
 *                 description: Unique license plate of the bus.
 *               noOfSeats:
 *                 type: number
 *                 description: Total number of seats in the bus.
 *               busType:
 *                 type: string
 *                 enum: [luxury, semi_luxury, normal]
 *                 description: The type of the bus.
 *               busOperatorId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the operator managing the bus.
 *               status:
 *                 type: string
 *                 enum: [available, maintenance, unavailable]
 *                 description: The current status of the bus.
 *               permitNo:
 *                 type: string
 *                 description: The permit number of the bus.
 *               permitStatus:
 *                 type: string
 *                 enum: [pending, approved]
 *                 description: The permit status of the bus.
 *             required:
 *               - licensePlate
 *               - noOfSeats
 *               - busType
 *               - status
 *       responses:
 *         201:
 *           description: Bus created successfully
 *         400:
 *           description: Invalid input
 *         500:
 *           description: Internal server error
 */

router.post('/', createBus);

/**
 * @swagger
 * /buses/{id}:
 *   get:
 *     summary: Retrieve a bus by ID
 *     tags: [Buses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus details
 */
router.get('/:id', getBusById);

module.exports = router;
