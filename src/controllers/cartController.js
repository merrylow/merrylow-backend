const cartService = require('../services/cartService');
const { sendError, sendSuccess } = require('../utils/responseHandler');


exports.getCartItems = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return sendError(res, 401, 'Unauthorized: User not found in request');
        }

        const cart = await cartService.getCartItemsByUser(user.id);

        if (!cart || !cart.items || cart.items.length === 0) {
          return sendSuccess(res, 200, { data: [] }, 'Your cart is empty');
        }

        return sendSuccess(res, 200, { data: cart }, 'Cart items retrieved successfully');


    } catch (error) {
        return sendError(res, 500, 'An unexpected error occurred while retrieving cart items', error);
    }
};


exports.addToCart = async (req, res) => {
  try {
    const user = req.user;
    /* selectedAddons: [
      {
        name: "egg", 		 // Must match one of the addon names in the menu.addOns array
        quantity: 2 		 // Optional. Required for quantity-based addons (e.g., eggs)
      },
      {
        name: "extra rice",
        customPrice: 15 	 // Optional. Required for range-based addons (e.g., extra rice)
      }
    ]

    Notes:
    - Only provide one of: `quantity` or `customPrice`
    - `customPrice` must be >= base addon price
    - The backend will handle validation and pricing. Do NOT calculate totals on frontend
    */

    // setting default selected addons because of the next validations
    const { productId, quantity, selectedAddons = [], basePrice, notes = "" } = req.body;

    if (!productId || !quantity || quantity < 1 || !Array.isArray(selectedAddons)) {
      return sendError(res, 400, 'Invalid input: productId, quantity, and selectedAddons are required');
    }

    const item = await cartService.addItemToCart( {
      userId: user.id,
      productId,
      quantity,
      selectedAddons,
      basePrice,
      notes,
    });

    return sendSuccess(res, 201, { data: item }, "Item added to cart successfully");

  } catch (error) {
    return sendError(res, 500, error.message || 'Server error', error);
  }
}


exports.updateCartItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const userId = req.user.id;
        const { quantity, selectedAddons = [], basePrice, notes} = req.body;

        if (!quantity || quantity < 1) { 
            return sendError(res, 400, "Quantity must be at least 1");
        }

        const updatedItem = await cartService.updateCartItem({
            itemId,
            userId,
            quantity,
            selectedAddons,
            notes,
        });

        return sendSuccess(res, 200, { data: updatedItem }, "Cart item updated successfully");

    } catch(error){
        return sendError(res, 500, error.message || "Something went wrong", error);
    }

}


exports.updateCartItemQuantity = async (req, res) => {
    try {
        const itemId = req.params.id;
        const userId = req.user.id;
        const { quantity} = req.body;

        if (!quantity || quantity < 1) {
            return sendError(res, 400, "Quantity must be at least 1");
        }

        const updatedItem = await cartService.updateCartItemQuantity(itemId, userId, quantity );

        return sendSuccess(res, 200, { data: updatedItem }, "Cart item updated successfully");

    } catch(error){
        return sendError(res, 500, error.message || "Something went wrong", error);
    }
}


exports.deleteFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId  = req.params.id;

        await cartService.deleteCartItem(userId, itemId);

        return sendSuccess(res, 200, {}, 'Item removed from cart successfully');
    } catch (err) {
        return sendError(res, 500, 'Failed to remove item from cart', err);
    }
};


exports.deleteAllCartItems = async (req, res) => {
    try {
        const userId = req.user.id;

        await cartService.clearCart(userId);

        return sendSuccess(res, 200, {}, 'Cart cleared successfully');

    } catch (err) {
        return sendError(res, 500, 'Failed to clear cart', err);
    }
}