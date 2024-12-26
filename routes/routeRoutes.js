const express = require('express');
const { getAllRoutes, createRoute, getRouteById } = require('../controllers/routeController');
const router = express.Router();

/**
 * @swagger
 * /buses:
 *   get:
 *     summary: Retrieve all Buses
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: List of all Buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bus'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllRoutes);

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
 *             $ref: '#/components/schemas/BusModel'
 *     responses:
 *       201:
 *         description: Bus created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/', createRoute);

// Get a route by ID (protected route)
/**
 * @swagger
 * /routes/{id}:
 *   get:
 *     summary: Get a route by ID
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The route ID
 *     responses:
 *       200:
 *         description: The requested route
 *         content:
 *           application/json:
 *             schema:
 *       404:
 *         description: Route not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getRouteById);

module.exports = router;