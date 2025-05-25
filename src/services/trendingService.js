const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTopVendors = async () => {
    const topVendors = await prisma.orderItem.groupBy({
        by: ['restaurantId'],
        _count: {
            restaurantId: true,
        },
        orderBy: {
            _count: {
                restaurantId: 'desc',
            },
        },
        take: 10,
    });

    const restaurantIds = topVendors.map((item) => item.restaurantId);

    const restaurants = await prisma.restaurant.findMany({
        where: {
            id: { in: restaurantIds },
        },
        include: {
            _count: {
                select: { orderItem: true },
            },
        },
    });

    // sort restaurants in same order as topVendors since findMany doesnt gaurantee an ordered data...
    const orderedRestaurants = restaurantIds.map((id) =>
        restaurants.find((r) => r.id === id),
    );

    return orderedRestaurants;
};

exports.getTopProducts = async () => {
    const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _count: {
            productId: true,
        },
        orderBy: {
            _count: {
                productId: 'desc',
            },
        },
        take: 10,
    });

    const productIds = topProducts.map((item) => item.productId);

    const menus = await prisma.menu.findMany({
        where: {
            id: { in: productIds },
        },
        include: {
            _count: {
                select: { orderItems: true },
            },
            restaurant: {
                select: {
                    name: true,
                    id: true,
                },
            },
        },
    });

    const orderedMenus = productIds.map((id) =>
        menus.find((menu) => menu.id === id),
    );

    return orderedMenus;
};
