const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const emailService = require('./emailService');
const getUserOrderConfirmationEmail = require('../utils/getUserOrderConfirmationEmail');
const getAdminOrderConfirmationEmail = require('../utils/getAdminOrderConfirmationEmail');
const getCurrentTime = require('../utils/getCurrentTime');

const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

const formatPrice = (price) =>
    new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
    }).format(Number(price));

const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

const paymentMethodMap = {
    MOBILE_MONEY: 'Mobile Money',
    CARD: 'Bank Card',
    CASH_ON_DELIVERY: 'Cash on Delivery',
};

async function sendOrderEmails(orderId) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    menu: true,
                    restaurant: true,
                },
            },
            user: {
                select: {
                    email: true,
                    name: true,
                },
            },
        },
    });

    if (!order) throw new Error('Order not found for email sending');

    const products = order.orderItems.map((item) => {
        let descriptionDetails = '';
        try {
            const descriptionObj = JSON.parse(item.description);
            descriptionDetails = Object.entries(descriptionObj)
                .filter(([key]) => key !== 'name')
                .map(([key, value]) => `${key} - GH$${value}`)
                .join(', ');
        } catch {
            descriptionDetails = item.description;
        }

        return {
            name: `${item.menu.name} - GH$${item.menu.price}${
                descriptionDetails ? ` - ${descriptionDetails}` : ''
            }`,
            vendorName: item.restaurant.name,
            vendorLink: `https://app.merrylow.com/api/vendors/${item.restaurant.id}`,
            quantity: item.quantity,
            price: formatPrice(item.totalPrice),
            note: item.notes,
        };
    });

    const emailData = {
        customerName: order.customerName,
        orderId: order.id,
        orderDate: formatDate(order.createdAt),
        products,
        subtotal: formatPrice(order.totalPrice),
        shipping: 'Free',
        total: formatPrice(order.totalPrice),
        paymentMethod: paymentMethodMap[order.paymentMethod] || order.paymentMethod,
        serviceType: 'Campus Delivery',
        serviceDate: formatDate(order.createdAt),
        serviceTime: getCurrentTime(),
        billingName: order.customerName,
        billingAddress: order.address.replace(/\\n/g, '\n'),
        billingPhone: order.customerPhone,
        billingEmail: order.user?.email || 'no-email@example.com',
        orderNote: order.notes,
    };

    // Send customer email
    await emailService.sendEmail(
        emailData.billingEmail,
        'Order Confirmation',
        `Your order (#${emailData.orderId}) has been confirmed!`,
        getUserOrderConfirmationEmail(emailData),
    );

    // Send admin email
    if (adminEmails.length > 0) {
        const adminEmailData = {
            ...emailData,
            serviceType: 'Free Delivery',
        };

        await emailService.sendAdminEmail(
            'merrylow.order@gmail.com',
            adminEmails,
            `New Order: #${adminEmailData.orderId}`,
            `New order notification for #${adminEmailData.orderId}`,
            getAdminOrderConfirmationEmail(adminEmailData),
        );
    }
}

module.exports = {
    sendOrderEmails,
};
