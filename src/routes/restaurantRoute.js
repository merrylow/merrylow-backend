const express = require('express');
const restaurantRoute = express.Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const {
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
} = require('../controllers/restaurantController');

//for now users who are not logged in can view restuarants
// restaurantRoute.use(verifyAccessToken);

if (process.env.NODE_ENV !== 'production') {
    console.log('[Route] GET /restaurants');
    console.log('[Route] GET /restaurants/:id');
}

restaurantRoute.get('/', getRestaurants);
restaurantRoute.get('/:id', getRestaurantById);
restaurantRoute.put('/:id', verifyAccessToken, updateRestaurant);
module.exports = restaurantRoute;
