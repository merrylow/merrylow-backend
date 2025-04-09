const orderRoute = require('express').Router();
const orderController = require('../controllers/orderController')
const verifyAccessToken = require('../middleware/verifyAccessToken');

orderRoute.use(verifyAccessToken);

orderRoute.get('/', orderController.getAllOrders);

module.exports = orderRoute;