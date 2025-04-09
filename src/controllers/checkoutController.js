const orderService = require('../services/orderService')

exports.checkout = async (req, res) => {
    const userId = req.user.id;

    try {
        const order = await orderService.placeOrder(userId);
        res.status(201).json({ message: "Order placed", order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
  