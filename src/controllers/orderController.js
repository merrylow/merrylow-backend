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


exports.getOrderById = async (req, res) => {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);
  
    try {
        const order = orderService.getOrderById(userId, orderId);
  
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
  
    res.status(200).json({ order });

    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
};
  

exports.placeOrder = async (req, res) => {
    const userId = req.user.id;
    const email = req.user.email;
    const { name, address, phone, notes, paymentMethod } = req.body;

    try {
        const result = await orderService.placeOrder(userId, {
            name, address, phone, notes, paymentMethod },
            email);

        res.status(201).json({
            success: true,
            ...result,
        });

    } catch (err) {
        console.error("Order Placement Error:", err);
        res.status(500).json({
        success: false,
        message: err.message || "Something went wrong while placing the order",
        });
    }
};


exports.cancelOrder = async (req, res) => {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);

    try {
        const result = await orderService.cancelOrder(orderId, userId);
        res.status(200).json({ message: 'Order cancelled', order: result });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
    }
};
