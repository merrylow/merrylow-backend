const restaurantService = require('../services/restaurantService');
const { sendError, sendSuccess } = require('../utils/responseHandler');


exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantService.getRestaurants();

        if (!restaurants || restaurants.length === 0) {
            return sendError(res, 404, 'No restaurants found');
        }

        return sendSuccess(res, 200, { data: restaurants });

    } catch (error) {
        return sendError(res, 500, 'Server Error', error);
    }
};


exports.getRestaurantById = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await restaurantService.getRestaurantById(id);

        if (!restaurant) {
            return sendError(res, 404, 'Restaurant not found');
        }

        return sendSuccess(res, 200, { data: restaurant });

    } catch (error) {
        return sendError(res, 500, 'Server Error', error);
    }
};