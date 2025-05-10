const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendError, sendSuccess } = require('../utils/responseHandler');


exports.checkout = async (req, res) => {
    const userId = req.user.id;

    try {

      if (res.body){
        const updatedCartItems = req.body.cartItems; // [{ id, quantity }, ...]

        for (const item of updatedCartItems) {
          const originalItem = await prisma.cartItem.findUnique({
              where: { id: item.id },
              select: { unitPrice: true }
          });

          if (!originalItem) continue;

          await prisma.cartItem.update({
              where: { id: item.id },
              data: {
                  quantity: item.quantity,
                  totalPrice: originalItem.unitPrice.mul(item.quantity), // Assuming unitPrice is a Decimal type
              },
          });
        }

      }

      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: true, 
          menu: true,
        },
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        return sendError(res, 400, "Your cart is empty.");
      }

      const totalPrice = cart.items.reduce(
        (sum, item) => sum.plus(new Prisma.Decimal(item.totalPrice || 0)), 
        new Prisma.Decimal(0)
      );

      return sendSuccess(res, 200, {
        cartItems: cart.items,
        restaurant: cart.menu,
        totalPrice,
      }, "Cart updated and ready for checkout");


    } catch (err) {
      return sendError(res, 500, "An error occurred while preparing checkout", err);
    }
  };