const cartService = require('../services/cartService');

exports.getCartItems = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User not found in request',
            });
        }

        const cart = await cartService.getCartItemsByUser(user.id);

        if (!cart || !cart.items || cart.items.length === 0) {
          return res.status(200).json({
            success: true,
            message: 'Your cart is empty',
            data: [], //the frontend can handle this case when the length of the array is 0
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'Cart items retrieved successfully',
          data: cart, // full cart object with items and metadata
        });
        

    } catch (error) {
        console.error('Error getting cart items:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while retrieving cart items',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};


exports.addToCart = async (req, res) => {
  try {
    const user = req.user;    
    /* selectedAddons: [
      {
        name: "egg",         // Must match one of the addon names in the menu.addOns array
        quantity: 2          // Optional. Required for quantity-based addons (e.g., eggs)
      },
      {
        name: "extra rice",
        customPrice: 15      // Optional. Required for range-based addons (e.g., extra rice)
      }
    ]
    
    Notes:
    - Only provide one of: `quantity` or `customPrice`
    - `customPrice` must be >= base addon price
    - The backend will handle validation and pricing. Do NOT calculate totals on frontend
    */
    
    // setting default selected addons because of the next validations
    const { menuId, quantity, selectedAddons = [], basePrice, notes } = req.body;

    if (!menuId || !quantity || quantity < 1 || !Array.isArray(selectedAddons)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input: menuId, quantity, and selectedAddons are required',
      });
    }

    const item = await cartService.addItemToCart( {
      userId: user.id,
      menuId,
      quantity,
      selectedAddons,
      basePrice,
      notes,
    });

    return res.status(201).json( {
      success: true,
      message: "Item added to cart",
      data: item,
    });

  } catch (error) {
    console.error('[addToCart ERROR]', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
}


exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    const { quantity, selectedAddons = [], basePrice, notes} = req.body;

    if (quantity && quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    };
    
    const updatedItem = await cartService.updateCartItem({
      itemId,
      userId,
      quantity,
      selectedAddons,
      notes,
    });

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedItem,
    });

  } catch(error){
    console.error(error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong",}); 
  }

}


exports.deleteFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    await cartService.deleteFromCart(userId, itemId);

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};


exports.deleteAllCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    await cartService.clearCart(userId);

    res.status(200).json({ message: 'Cart cleared successfully' });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}