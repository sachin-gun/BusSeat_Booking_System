const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permitController');

// Route to create a new permit
router.post('/permits', permitController.createPermit);

// Route to update permit status
router.put('/permits/:id', permitController.updatePermitStatus);

// Route to search permits
router.get('/permits', permitController.searchPermits);

module.exports = router;
