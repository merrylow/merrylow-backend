const checkoutRoute = require('express').Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const chekoutController = require('../controllers/checkoutController');

checkoutRoute.use(verifyAccessToken);

checkoutRoute.post('/', chekoutController.checkout);

module.exports = checkoutRoute;