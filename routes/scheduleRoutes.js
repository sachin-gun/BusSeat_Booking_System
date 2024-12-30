const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers//scheduleController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// List schedules
router.get('/schedules', authenticate, authorize(['admin']) ,scheduleController.listSchedules);

// Create a new schedule
router.post('/schedules',authenticate, authorize(['admin']),  scheduleController.createSchedule);

// Update a schedule
router.put('/schedules/:id', authenticate, authorize(['admin']), scheduleController.updateSchedule);

// Delete a schedule
router.delete('/schedules', authenticate, authorize(['admin']), scheduleController.deleteSchedule);

// get data by Id
router.get('/schedule', authenticate, authorize(['admin']), scheduleController.getScheduleById);

router.get('/schedule-by-points',authenticate,authorize(['admin']),scheduleController.getSchedulesByPoints);

module.exports = router;
