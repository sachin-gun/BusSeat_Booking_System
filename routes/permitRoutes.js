const express = require('express');
const { getAllPermits, createPermit, getPermitById } = require('../controllers/permitController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permits
 *   description: API for managing permits
 */

/**
 * @swagger
 * /permits:
 *   get:
 *     summary: Retrieve all permits
 *     tags: [Permits]
 *     responses:
 *       200:
 *         description: List of all permits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permit'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllPermits);

/**
 * @swagger
 * /permits:
 *   post:
 *     summary: Create a new permit
 *     tags: [Permits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               busId:
 *                 type: string
 *                 description: The ID of the bus for which the permit is issued.
 *               routeId:
 *                 type: string
 *                 description: The ID of the route for the permit.
 *               validThrough:
 *                 type: string
 *                 format: date
 *                 description: The validity date of the permit.
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: The status of the permit.
 *             required:
 *               - busId
 *               - routeId
 *               - validThrough
 *       responses:
 *         201:
 *           description: Permit created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Permit'
 *         400:
 *           description: Bad request
 *         500:
 *           description: Internal server error
 */
router.post('/', createPermit);

/**
 * @swagger
 * /permits/{id}:
 *   get:
 *     summary: Retrieve a permit by ID
 *     tags: [Permits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the permit to retrieve
 *     responses:
 *       200:
 *         description: Permit details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permit'
 *       404:
 *         description: Permit not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getPermitById);

module.exports = router;
