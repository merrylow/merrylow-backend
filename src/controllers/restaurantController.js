const restaurantService = require('../services/restaurantService');
const { sendError, sendSuccess } = require('../utils/responseHandler');
const redisClient = require("../config/redis");

exports.getRestaurants = async (req, res) => {
    try {
        const cacheKey = "restaurants_cache";

        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            const restaurants = JSON.parse(cachedData);
            return sendSuccess(res, 200, { source: "cache", data: restaurants });
        }

        const restaurants = await restaurantService.getRestaurants();

        if (!restaurants || restaurants.length === 0) {
            return sendError(res, 404, 'No restaurants found');
        }

        await redisClient.set(cacheKey, JSON.stringify(restaurants), "EX", 86400);

        return sendSuccess(res, 200, { source: "db", data: restaurants });

    } catch (error) {
        return sendError(res, 500, 'Server Error', error);
    }
};


exports.getRestaurantById = async (req, res) => {
    const { id } = req.params;
    const cacheKey = `restaurant_${id}`;

    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            const restaurant = JSON.parse(cachedData);
            return sendSuccess(res, 200, { source: 'cache', data: restaurant });
        }

        const restaurant = await restaurantService.getRestaurantById(id);
        if (!restaurant) {
            return sendError(res, 404, 'Restaurant not found');
        }

        await redisClient.set(cacheKey, JSON.stringify(restaurant));

        return sendSuccess(res, 200, { source: 'db', data: restaurant });

    } catch (error) {
        return sendError(res, 500, 'Server Error', error);
    }
};



exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { userRole } = req.user;
        const data = req.body;

        if (!userRole || userRole !== "admin") {
            return sendError(res, 401, "Unauthorized: Admin access required");
        }

        const updated = await restaurantService.updateRestaurant({ data, id})

        await redisClient.del("restaurants_cache");

        await redisClient.del(`restaurant_${id}`);

        return sendSuccess(res, 200, { data: updated }, "Restaurant updated successfully");

    } catch (error) {
        return sendError(res, 500, "Update error", error);
    }
};