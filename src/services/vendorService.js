const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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


exports.getProducts = async (vendorId, restaurantId = null) => {
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
