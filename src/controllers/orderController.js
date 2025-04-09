const orderService = require('../services/orderService');

exports.getAllOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await orderService.getOrders(userId);
        
        if (!orders  || orders.orderItems.length === 0){
            return res.status(200).json({
                success: true,
                message: 'Your have not made any orders yet',
                data: [],
              });       
        }

        res.status(200).json({ data : orders});

    } catch(err){
        console.error("Error getting orders", err);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while retrieving order items',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });    
    }
}