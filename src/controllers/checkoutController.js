const { PrismaClient, Prisma  } = require('@prisma/client');
const prisma = new PrismaClient();

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
                  totalPrice: originalItem.unitPrice.mul(item.quantity),
              },
          });
        }
        
      }

      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: true,
        },
      });
  
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Your cart is empty." });
      }
  
      const totalPrice = cart.items.reduce(
        (sum, item) => sum.plus(item.totalPrice),
        new Prisma.Decimal(0)
      );
  
      res.status(200).json({
        message: "Cart updated and ready for checkout",
        cartItems: cart.items,
        restaurant: cart.menu,
        totalPrice,
      });
  
    } catch (err) {
      console.error("Checkout Error:", err);
      res.status(500).json({
        success: false,
        message: "An error occurred while preparing checkout",
      });
    }
  };
  