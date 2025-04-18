const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// since we wouldnt want any restaurant to edit another resturants details... we always make sure we fetch data related to that vendor and restaurant alone
//  if a user is confirmed to be a vendor, lets make sure they can only access their own restaurant and products

exports.getRestaurants = async (vendorId) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            where: {
                ownerId: vendorId,
            },
        });    
        return restaurants;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw new Error('Could not fetch restaurants');
    }
}


exports.getRestaurantById = async (vendorId, restaurantId) => {
    try {
        return await prisma.restaurant.findUnique ( {
            where: {
                id : restaurantId,
                ownerId : vendorId
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                        // phone: true :update here later when included in the database schema
                    }
                },
                menus: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
            }
        })
    } catch (error){
        console.error('Error fetching restaurant:', error);
        throw new Error('Could not fetch restaurant');
    }
}


exports.getProducts = async (vendorId, restaurantId = null) => {
    // here we either get all products of the vendor or get products from one of the vendors Restaurants(assuming the restaurantId is provided)
    try {
        if (restaurantId) {
            const restaurant = await prisma.restaurant.findFirst({
                where: {
                    id: restaurantId,
                    ownerId: vendorId,
                },
                select: { id: true },
            });

            if (!restaurant) {
                throw new Error('Unauthorized access to restaurant');
            }

            return await prisma.menu.findMany({
                where: {
                    restaurantId,
                },
            });
        }

        // If no restaurantId is provided, get all menus across vendor's restaurants
        return await prisma.menu.findMany({
            where: {
                restaurant: {
                    ownerId: vendorId,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Could not fetch products');
    }
};


exports.getProductById = async (vendorId, restaurantId, productId) => {
    try {

        const product = await prisma.menu.findUnique({
            where: {
                id: productId,
            },
            include: {
                restaurant: true,
            },
        });
        
        if (!product || product.restaurant.ownerId !== vendorId) {
            throw new Error('Unauthorized access to restaurant');
        }
        
        if (restaurantId && product.restaurantId !== restaurantId) {
            throw new Error('Restaurant ID mismatch');
        }
        
        return product;
    } catch (error) {
        throw new Error("Error fetching product: " + error.message);
    }
}


exports.addRestaurant = async (data) => {
    try {
        const newRestaurant = await prisma.restaurant.create({
            data: {
                ...data,
                verified: false,
            },
        });
        return newRestaurant;
    } catch (error) {
        console.error("Error creating restaurant:", error);
        throw new Error("Could not create restaurant");
    }
};


exports.updateRestaurant = async (vendorId, restaurantId, data) => {
    try {
        const updatedRestaurant = await prisma.restaurant.update({
            where: {
                id: restaurantId,
                ownerId: vendorId,
            },
            data: data,
        });
        return updatedRestaurant;
    } catch (error) {
        console.error('Error updating restaurant:', error);
        throw new Error('Could not update restaurant');
    }
}


exports.addProduct = async (vendorId, restaurantId, data) => {
    try {
        // we can first verify if the restuarant id belongs to that particular vendor, for extra security reasons... 
        // but that will mean that we'll make 2 calls to the DB
        // i.e we call the restaurant table, check if the onwerId of the restaurantId matches the vendorId provided
        // probably find a way to optimize the query later....

        const restaurant = await prisma.restaurant.findFirst({
            where: {
                id: restaurantId,
                ownerId: vendorId,
            },
            select: { id: true },
        });

        if (!restaurant) {
            throw new Error("Unauthorized: Vendor does not own this restaurant");
        }

        const newProduct = await prisma.menu.create({
            data: {
                name: data.name,
                description: data.description || null,
                price: data.price,
                restaurantId,
                addOns: data.addOns || null,
            },
        });

        return newProduct;

    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error(error.message || 'Could not add product');
    }
};


exports.updateProduct = async (vendorId, productId, data) => {
    try {

        const product = await prisma.menu.findFirst({
            where: {
                id: productId,
            },
            include: {
                restaurant: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        });

        if (!product || product.restaurant.ownerId !== vendorId) {
            throw new Error("Unauthorized: Vendor does not own this restaurant or product not found");
        }

        const updateData = {};

        if (data.name) updateData.name = data.name;
        if (data.price) updateData.price = data.price;
        if (data.description) updateData.description = data.description;
        if (data.addOns) updateData.addOns = data.addOns;
        if (typeof data.available === "boolean") updateData.available = data.available;
        // category will be handled later...

        const updatedProduct = await prisma.menu.update({
            where: {
                id: productId,
            },
            data: updateData,
        });

        return updatedProduct;

    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error(error.message || 'Could not update product');
    }
};


exports.deleteProduct = async (vendorId, restaurantId, productId) => {
    try {

        const product = await prisma.menu.findFirst({
            where: {
                id: productId,
                restaurantId: restaurantId,
            },
            include: {
                restaurant: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        });

        if (!product || product.restaurant.ownerId !== vendorId) {
            throw new Error('Unauthorized: Vendor does not own this restaurant or product not found');
        }

        const deletedProduct = await prisma.menu.delete({
            where: {
                id: productId,
            },
        });

        return deletedProduct;

    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error(error.message || 'Could not delete product');
    }
};


exports.deleteRestaurant = async (vendorId, restaurantId) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { ownerId: true },
        });

        if (!restaurant || restaurant.ownerId !== vendorId) {
            throw new Error('Unauthorized: Vendor does not own this restaurant or restaurant not found');
        }

        const deletedRestaurant = await prisma.restaurant.delete({
            where: {
                id: restaurantId,
            },
        });

        return deletedRestaurant;

    } catch (error) {
        console.error('Error deleting restaurant:', error);
        throw new Error(error.message || 'Could not delete restaurant');
    }
};


exports.fetchVendorOrders = async (vendorId, status) => {
    return await prisma.order.findMany({
        where: {
            restaurant : {
                ownerId : vendorId,
            },
            ...(status && { status })
        },
        include: {
            orderItems: {
                include: { menu: true }
            },
            user: true
        },
        orderBy: {
            createdAt: 'desc'
        }
  });
};


exports.fetchVendorOrderById = async (orderId, vendorId) => {
    return await prisma.order.findFirst({
        where: {
            id: orderId,
            restaurant : {
                ownerId: vendorId,
            }
        },
        include: {
            orderItems: {
                include: { menu: true }
            },
            user: true
        }
    });
};


exports.updateOrderStatus = async (orderId, vendorId, status) => {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            restaurant: {
                ownerId: vendorId,
            }
        }
    });

    if (!order) return null;

    return await prisma.order.update({
        where: { id: orderId },
            data: { status }
    });
};