const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/userController');
const verifyAccessToken = require('../middleware/verifyAccessToken');

userRoute.get('/me', verifyAccessToken, userController.getCurrentUser);

module.exports = userRoute;
