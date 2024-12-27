
const express = require('express');
const router = express.Router();
const userController = require('.//..//controllers//userController');


// User routes
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.put('/users/reset-password/:id', userController.updateUserPassword);
router.get('/users', userController.searchUsers);
router.delete('/users/:id', userController.deleteUser);
router.post('/login', userController.login);

module.exports = router;
