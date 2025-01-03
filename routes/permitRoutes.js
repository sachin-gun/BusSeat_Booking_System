const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permitController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Route to create a new permit
router.post('/permits',authenticate, authorize(['admin','bus_operator']), permitController.createPermit);

// Route to update permit status
router.put('/permits/:id', authenticate, authorize(['admin','bus_operator']),permitController.updatePermitStatus);

// Route to search permits
router.get('/permits', authenticate, authorize(['admin','bus_operator']),permitController.searchPermits);

// get data by Id
router.get('/permit', authenticate, authorize(['admin']), permitController.getPermitById);

// delete
router.delete('/permits',authenticate, authorize(['admin','bus_operator']), permitController.deletePermit);

module.exports = router;
