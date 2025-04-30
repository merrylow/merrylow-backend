const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handleWebhook = async (req, res) => {
    const secret = process.env.PAYSTACK_TEST_SECRET_KEY;

    const hash = crypto
        .createHmac('sha512', secret)
        .update(req.rawBody)
        .digest('hex');
  
    // Check if it's really Paystack
    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(401).send('Unauthorized');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
        const orderId = event.data.metadata.orderId;

        try {
            await prisma.order.update({
                where: { id: orderId },
                data: {
                status: 'PAID',
                payment: {
                    create: {
                    reference: event.data.reference,
                    amount: event.data.amount / 100,
                    channel: event.data.channel,
                    currency: event.data.currency,
                    status: event.data.status,
                    paidAt: new Date(event.data.paid_at),
                    },
                },
                },
            });  

            return res.status(200).send('Payment processed');
        } catch (err) {
            console.error("Error updating order from webhook:", err);
            return res.status(500).send("Error updating order");
        }
    }
    else if (event === 'charge.failed' || event.event === 'charge.abandoned') {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'FAILED',
          },
        });
  
        return res.status(200).json({ message: 'Payment failed, order status updated' });
    } 
    
    res.status(200).send("Event received");
};