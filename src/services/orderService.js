const {PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const getUserOrderConfirmationEmail = require('../utils/getUserOrderConfirmationEmail');
const getUserOrderCompletionEmail = require('../utils/getUserOrderCompletionEmail');
const getAdminOrderConfirmationEmail = require('../utils/getAdminOrderConfirmationEmail');
const getAdminOrderCancellationEmail = require('../utils/getAdminOrderCancellationEmail');
const emailService = require('../services/emailService');
const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
const axios = require('axios');


exports.placeOrder = async (userId, details, email) => {
  const { address, notes, paymentMethod, name, phone } = details;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          menu: {
            include: {
              restaurant: true
            }
          }
        }
      }
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum.plus(item.totalPrice),
    new Prisma.Decimal(0)
  );

  const order = await prisma.order.create({
    data: {
      userId,
      status: paymentMethod === "CASH_ON_DELIVERY" ? "PLACED" : "PENDING",
      paymentMethod,
      totalPrice,
      customerName: name,
      customerPhone: phone,
      address,
      notes,
      orderItems: {
        create: cart.items.map(item => ({
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
          method: paymentMethod,
          status: paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PENDING",
        }
      }
    },
  });

  await prisma.cart.delete({ where: { id : cart.id } });

  if (paymentMethod === "paystack" || paymentMethod==="MOBILE_MONEY") {
    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: totalPrice.toNumber() * 100, // Paystack expects amount in kobo / pesewas
        metadata: { orderId: order.id },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
      }
    );

    return {
      message: "Payment initiated with Paystack",
      paymentUrl: paystackRes.data.data.authorization_url,
      orderId: order.id,
    };
  }

  //if the payment detials is cash on delivery then we send the user and admins email about the order
  const populatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
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

  if (!populatedOrder) {
    throw new Error("Failed to retrieve order details");
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(Number(price));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const paymentMethodMap = {
    MOBILE_MONEY: 'Mobile Money',
    CARD: 'Bank Card',
    CASH_ON_DELIVERY: 'Cash on Delivery',
  };

  const products = populatedOrder.orderItems.map(item => {
    let descriptionDetails = '';
    try {
      const descriptionObj = JSON.parse(item.description);
      descriptionDetails = Object.entries(descriptionObj)
        .map(([key, value]) => `${key} - ${value}`)
        .join(' - ');
    } catch {
      descriptionDetails = item.description;
    }

    return {
      name: `${item.menu.name}${descriptionDetails ? ` - ${descriptionDetails}` : ''}`,
      vendorName: item.restaurant.name,
      vendorLink: `https://app.merrylow.com/api/vendors/${item.restaurant.id}`,
      quantity: item.quantity,
      price: formatPrice(item.totalPrice),
    };
  });

  const emailData = {
    customerName: populatedOrder.customerName,
    orderId: populatedOrder.id,
    orderDate: formatDate(populatedOrder.createdAt),
    products,
    subtotal: formatPrice(populatedOrder.totalPrice),
    shipping: "Free delivery", // in case something is added to shipping... then total wihh increase by this amount
    total: formatPrice(populatedOrder.totalPrice),
    paymentMethod: paymentMethodMap[populatedOrder.paymentMethod] || populatedOrder.paymentMethod,
    serviceType: "Campus Delivery", // Update with actual service type if available
    serviceDate: formatDate(populatedOrder.createdAt),
    serviceTime: "", // Add actual service time if available
    billingName: populatedOrder.customerName,
    billingAddress: populatedOrder.address.replace(/\\n/g, '\n'),
    billingPhone: populatedOrder.customerPhone,
    billingEmail: populatedOrder.user?.email || 'no-email@example.com',
  };

  await emailService.sendEmail(
    emailData.billingEmail,
    'Order Confirmation',
    `Your order (#${emailData.orderId}) has been confirmed!`,
    getUserOrderConfirmationEmail(emailData)
  );

  const adminEmailData = {
    ...emailData,
    serviceType: "Home Delivery",
    serviceTime: "",
  };

  // Send admin notifications
  if (adminEmails.length > 0) {
    console.log(adminEmails)
    await emailService.sendAdminEmail(
      'ziglacity@gmail.com', // change this to the Main merrylow account which everyone has access to...
      adminEmails, // All admins will be BCC'd
      `New Order: #${adminEmailData.orderId}`,
      `New order notification for #${adminEmailData.orderId}`,
      getAdminOrderConfirmationEmail(adminEmailData),
    );
  }

  return {
    message: "Order placed with Cash on Delivery",
    order,
  };
};


exports.getOrders = async ( userId ) => {
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
  

    if (!order || order.orderItems.length === 0) {
        throw new Error("Order History is empty");
    }

    return order;
}


exports.getOrderById = async (orderId, userId) => {

    return await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        orderItems: {
          include: { menu: true }
        },
        restaurant: true,
        payment: true,
        delivery: true
      }
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

