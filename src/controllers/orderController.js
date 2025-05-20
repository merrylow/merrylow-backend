const orderService = require('../services/orderService');
const { sendError, sendSuccess } = require('../utils/responseHandler');

exports.getAllOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await orderService.getOrders(userId);

        if (!orders || !orders.orderItems || orders.orderItems.length === 0) {
            return sendSuccess(res, 200, { data: [] }, 'You have not made any orders yet');
        }

        return sendSuccess(res, 200, { data : orders});

    } catch(err){
        return sendError(res, 500, 'An unexpected error occurred while retrieving order items', err);
    }
}


exports.getOrderById = async (req, res) => {
    const userId = req.user.id;
    const orderId = parseInt(req.params.orderId);

    // later add validation for orderId

    try {
        const order = await orderService.getOrderById(userId, orderId); 

        if (!order) {
            return sendError(res, 404, 'Order not found');
        }

        return sendSuccess(res, 200, { order });

    } catch (err) {
        return sendError(res, 500, 'Something went wrong', err);
    }
};


exports.placeOrder = async (req, res) => {
    const userId = req.user.id;
    const email = req.user.email;
    const { name, address, phone, notes, paymentMethod } = req.body;

    // Add input validation for name, address, phone, paymentMethod here

    try {
        const result = await orderService.placeOrder(userId, {
                name, address, phone, notes, paymentMethod },
                email);

        return sendSuccess(res, 201, { ...result });

    } catch (err) {
        return sendError(res, 500, err.message || "Something went wrong while placing the order", err);
    }
};


exports.cancelOrder = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    // Add validation for orderId
    try {
        const result = await orderService.cancelOrder(orderId, userId);
        return sendSuccess(res, 200, { order: result }, 'Order cancelled');
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return sendError(res, statusCode, error.message || 'Internal Server Error', error);
    }
};