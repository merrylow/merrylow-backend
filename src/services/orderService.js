const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const generateRandomId = require('../utils/generateRandomId');
const { sendOrderEmails } = require('./sendOrderEmails');
const PAYSTACK_KEY =
    process.env.NODE_ENV === 'development'
        ? process.env.PAYSTACK_TEST_SECRET_KEY
        : process.env.PAYSTACK_LIVE_SECRET_KEY;

exports.placeOrder = async (userId, details, email) => {
    const { address, notes, paymentMethod, name, phone } = details;

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    menu: {
                        include: {
                            restaurant: true,
                        },
                    },
                },
            },
        },
    });

    if (!cart || cart.items.length === 0) {
        throw new Error('Your cart is empty.');
    }

    const totalPrice = cart.items.reduce(
        (sum, item) => sum.plus(item.totalPrice),
        new Prisma.Decimal(0),
    );

    const order = await prisma.order.create({
        data: {
            id: generateRandomId(),
            userId,
            status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PLACED' : 'PENDING',
            paymentMethod:
                paymentMethod === 'CASH_ON_DELIVERY' || paymentMethod === 'cod'
                    ? 'CASH_ON_DELIVERY'
                    : 'MOBILE_MONEY',
            totalPrice,
            customerName: name,
            customerPhone: phone,
            address,
            notes,
            orderItems: {
                create: cart.items.map((item) => ({
                    productId: item.productId,
                    restaurantId: item.menu.restaurantId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    description: item.description,
                    notes: item.notes,
                })),
            },
            payment: {
                create: {
                    amount: totalPrice,
                    method:
                        paymentMethod === 'CASH_ON_DELIVERY' || paymentMethod === 'cod'
                            ? 'CASH_ON_DELIVERY'
                            : 'MOBILE_MONEY',
                    status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PENDING',
                },
            },
        },
    });

    await prisma.cart.delete({ where: { id: cart.id } });

    if (paymentMethod === 'paystack' || paymentMethod === 'MOBILE_MONEY') {
        const paystackRes = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: totalPrice.toNumber() * 100, // Paystack expects amount in kobo / pesewas
                metadata: { orderId: order.id },
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        return {
            message: 'Payment initiated with Paystack',
            paymentUrl: paystackRes.data.data.authorization_url,
            orderId: order.id,
        };
    }

    //if the payment detials is cash on delivery then we send the user and admins email about the order
    await sendOrderEmails(order.id);

    return {
        message: 'Order placed with Cash on Delivery',
        order,
    };
};

exports.getOrders = async (userId) => {
    const order = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            orderItems: {
                include: {
                    menu: true,
                },
            },
            restaurant: true,
            payment: true,
            delivery: true,
        },
    });

    return order;
};

exports.getOrderById = async (orderId, userId) => {
    return await prisma.order.findFirst({
        where: { id: orderId, userId },
        include: {
            orderItems: {
                include: { menu: true },
            },
            restaurant: true,
            payment: true,
            delivery: true,
        },
    });
};

exports.cancelOrder = async (orderId, userId) => {
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
    });

    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    //user won't be able to cancle after certain status... will be modified later
    if (!['ACCEPTED', 'IN_PROGRESS'].includes(order.status)) {
        const error = new Error('Order cannot be cancelled at this stage');
        error.statusCode = 400;
        throw error;
    }

    const cancelledOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
    });

    return cancelledOrder;
};
