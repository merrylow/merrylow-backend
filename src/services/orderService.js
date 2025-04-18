const {PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// this logic needs to be changed... since the user will select specific items from the cart before checkout
//hence we dont have to fetch all the items
exports.placeOrder = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: true,
      menu: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum.plus(item.totalPrice),
    new Prisma.Decimal(0)
  );

  const order = await prisma.order.create({
    data: {
      userId,
      restaurantId: cart.menu.restaurantId,
      totalPrice,
      orderItems: {
        create: cart.items.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          description: item.description,
          notes: item.notes,
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
//   after deletion, the frontend can decide to remove those cartItems from the user's cart imediately...

  return order;
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

