const orderRoute = require('express').Router();
const orderController = require('../controllers/orderController')
const verifyAccessToken = require('../middleware/verifyAccessToken');

orderRoute.use(verifyAccessToken);

orderRoute.get('/', orderController.getAllOrders);
orderRoute.get('/:id', orderController.getOrderById);
orderRoute.post('/', orderController.placeOrder);
orderRoute.patch('/:id', orderController.cancelOrder);

module.exports = orderRoute;