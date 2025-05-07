const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Decimal = require('decimal.js');
const processSelectedAddons = require('../utils/processSelectedAddons')

exports.getCartItemsByUser = async (userId) => {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
      },
    });
  
    return cart;
  };
  
  
exports.addItemToCart = async ({ userId, menuId, quantity, selectedAddons, basePrice, notes }) => {
  const menu = await prisma.menu.findUnique( { where: {id: menuId}});

  // the frontend should make sure that menus or items that are not available should not have the add to cart features so that we don't waste resources processing that data
  if(!menu || !menu.available)  throw new Error("Menu item not found or unavailable");

  const realBasePrice = new Decimal(menu.price); 
  const selectedBasePrice = new Decimal(basePrice);

  if (selectedBasePrice.lessThan(realBasePrice)) {
    throw new Error('Base price cannot be less than menu price');
  }

  const menuAddOns = menu.addOns || [];

  const {addonsTotal, description} = processSelectedAddons(selectedAddons, menuAddOns)

  const unitPrice = selectedBasePrice.plus(addonsTotal);
  const totalPrice = unitPrice.times(quantity);

  // create cart if it doesnt exist
  const cart = await prisma.cart.findUnique( {
    where: { userId },
  })

  if (!cart){
    cart = await prisma.cart.create( {
      data: { userId },
    })
  }

  // to prevent duplicate cart item, i'll work on merging the the items based on the menuId and description, but for now this is standard
  const newCartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      menuId,
      quantity,
      unitPrice: unitPrice.toDecimalPlaces(2),
      totalPrice: totalPrice.toDecimalPlaces(2),
      description: JSON.stringify(description),
      notes: notes || null,
    },
  });


  return {
    message: 'Item added to cart successfully',
    data: newCartItem,
  }; 
}


exports.updateCartItem = async ( { itemId, userId, quantity, selectedAddons, basePrice, notes}) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
      menu: true,
    },
  });
  
  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Unauthorized or item not found");
  }

  const realBasePrice = new Decimal(cartItem.menu.price); 
  const selectedBasePrice = new Decimal(basePrice);

  if (selectedBasePrice.lessThan(realBasePrice)) {
    throw new Error('Base price cannot be less than menu price');
  }

  const menuAddOns = cartItem.menu.addOns || [];
  const { addonsTotal, description} = processSelectedAddons(selectedAddons, menuAddOns)
  
  const unitPrice = updatedBasePrice.plus(addonsTotal);
  const finalQuantity = quantity || cartItem.quantity;
  const totalPrice = unitPrice.times(finalQuantity);

  const updatedItem = await prisma.cartItem.update({
    where: { id: itemId },
    data: {
      quantity: finalQuantity,
      unitPrice: unitPrice.toDecimalPlaces(2),
      totalPrice: totalPrice.toDecimalPlaces(2),
      description: JSON.stringify(description),
      notes: notes ?? cartItem.notes,
    },
  });
  
  return {
    message: 'Cart item updated successfully',
    data: updatedItem,
  }; 
} 


//for now users will only be able to update the quantity of their cartItem
exports.updateCartItemQuantity = async (itemId, userId, quantity) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
    },
  });
  
  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Unauthorized or item not found");
  }

  const unitPrice = cartItem.unitPrice;
  const totalPrice = unitPrice.times(quantity);
  
  return await prisma.cartItem.update({
    where: {
      id: itemId
    },
    data: {
      totalPrice: totalPrice,
      quantity
    }
  });

  //in case we have to return the full cart instead
  // const fullCart = await prisma.cart.findUnique({
  //   where: {
  //     userId: userId
  //   },
  //   include: {
  //     items: {
  //       include: {
  //         menu: true
  //       }
  //     }
  //   }
  // });

  // return fullCart;
}


exports.deleteCartItem = async ( userId, itemId ) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error('Item not found or access denied');
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });
}


exports.clearCart = async ( {userId }) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) throw new Error('Cart not found');

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
}
  