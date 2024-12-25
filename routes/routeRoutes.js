const express = require('express');
const { getAllRoutes, createRoute, getRouteById } = require('../controllers/routeController');
const router = express.Router();

// Get all routes (protected route)
/**
 * @swagger
 * /routes:
 *   get:
 *     summary: Get all routes
 *     tags: [Routes]
 *     responses:
 *       200:
 *         description: List of all routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllRoutes);

// Create a route (protected route)
/**
 * @swagger
 * /routes:
 *   post:
 *     summary: Create a new route
 *     tags: [Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *               - routeNo
 *               - from
 *               - to
 *               - avgMinutes
 *               - startTime
 *               - endTime
 *             properties:
 *               routeId:
 *                 type: string
 *                 description: Unique identifier for the route
 *               routeNo:
 *                 type: string
 *                 description: Route number
 *               from:
 *                 type: string
 *                 description: Starting point of the route
 *               to:
 *                 type: string
 *                 description: Ending point of the route
 *               avgMinutes:
 *                 type: number
 *                 description: Average time (in minutes) for the route
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Route start time (ISO format)
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Route end time (ISO format)
 *     responses:
 *       201:
 *         description: Route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Route created successfully
 *      
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