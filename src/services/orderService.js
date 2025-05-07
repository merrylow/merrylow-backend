const {PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();


exports.placeOrder = async (userId, details, email) => {
  const { address, notes, paymentMethod, name, phone } = details;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: true,
      menu: true,
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
      restaurantId: cart.menu.restaurantId,
      status: paymentMethod === "cod" ? "PLACED" : "PENDING",
      paymentMethod,
      totalPrice,
      customerName: name,
      customerPhone: phone,
      address,
      notes,

      orderItems: {
        create: cart.items.map(item => ({
          menuId: item.menuId,
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
          status: paymentMethod === "cod" ? "PENDING" : "PENDING",
          // transactionId will be filled later by webhook for paystack
        }
      }
    },
    include: {
      orderItems: true,
      payment: true
    }
  });

  await prisma.cart.delete({ where: { userId } });

  if (paymentMethod === "paystack") {
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

