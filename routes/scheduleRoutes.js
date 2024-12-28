const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers//scheduleController');

// List schedules
router.get('/schedules', scheduleController.listSchedules);

// Create a new schedule
router.post('/schedules', scheduleController.createSchedule);

// Update a schedule
router.put('/schedules/:id', scheduleController.updateSchedule);

// Delete a schedule
router.delete('/schedules/:id', scheduleController.deleteSchedule);

module.exports = router;
