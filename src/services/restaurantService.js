const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRestaurants = async () => {
    try {
        return await prisma.restaurant.findMany({
            where: {
                available: true,
            },
        });
    } catch (error) {
        console.error('DB Error (getRestaurants):', error);
        throw new Error('Failed to fetch available restaurants');
    }
};

exports.getRestaurantById = async (restaurantId) => {
    try {
        return await prisma.restaurant.findUnique({
            where: {
                id: restaurantId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                menus: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                // avatar: true frontend will handle the avatar, maybe use some dummy avatar for now, later we'll be using user images
                            },
                        },
                    },
                },
                // optionally include other fields like openingHours, categories, etc.
            },
        });
    } catch (error) {
        console.error(`DB Error (getRestaurantById:${restaurantId}):`, error);
        throw new Error('Failed to fetch restaurant');
    }
};

exports.updateRestaurant = async ({ data, id }) => {
    try {
        return prisma.restaurant.update({
            where: { id },
            data,
        });
    } catch (error) {
        console.error('DB Error (updateRestaurant):', error);
        throw new Error('Failed to update restaurant');
    }
};
