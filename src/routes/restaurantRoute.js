const express = require('express');
const restaurantRoute = express.Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const { getRestaurants, getRestaurantById } = require('../controllers/restaurantController');

restaurantRoute.use(verifyAccessToken);

if (process.env.NODE_ENV !== 'production') {
    console.log('[Route] GET /restaurants');
    console.log('[Route] GET /restaurants/:id');
}

restaurantRoute.get('/', getRestaurants);
restaurantRoute.get('/:id', getRestaurantById);

module.exports = restaurantRoute;
