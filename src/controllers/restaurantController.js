const restaurantService = require('../services/restaurantService');


exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantService.getRestaurants();
        
        if (!restaurants || restaurants.length === 0) {
            return res.status(404).json({ success: false, message: 'No restaurants found' });
        }

        res.status(200).json({ success: true, data: restaurants });

    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


exports.getRestaurantById = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await restaurantService.getRestaurantById(id);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        res.status(200).json({ success: true, data: restaurant });

    } catch (error) {
        console.error(`Error fetching restaurant ${id}:`, error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
