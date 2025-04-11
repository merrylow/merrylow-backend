const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getProducts = async (productName, limit, page) => {
    try {
        const skip = (page - 1) * limit;

        const products = await prisma.menu.findMany({
            where: productName ? {
                name: {
                    contains: productName,
                    mode: 'insensitive',
                },
            } : {},
            include: {
                restaurant: true,
            },
            skip: skip,
            take: limit
        });

        return products;

    } catch (error) {
        throw new Error("Error fetching products: " + error.message);
    }
}


exports.getProductById = async (productId) => {
    try {
        const product = await prisma.menu.findUnique({
            where: {
                id: productId,
            },
            include: {
                restaurant: true,
            },
        });
        return product;
    } catch (error) {
        throw new Error("Error fetching product: " + error.message);
    }
}