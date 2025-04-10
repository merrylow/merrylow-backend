const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRestaurants = async () => {
    try {
        return await prisma.restaurant.findMany();
    } catch (error) {
        console.error('DB Error (getRestaurants):', error);
        throw new Error('Failed to fetch restaurants');
    }
};

exports.getRestaurantById = async (restaurantId) => {
    try {
        return await prisma.restaurant.findUnique({
            where: {
                id: restaurantId
            }
        });
    } catch (error) {
        console.error(`DB Error (getRestaurantById:${restaurantId}):`, error);
        throw new Error('Failed to fetch restaurant');
    }
};
