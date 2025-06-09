const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendOrderEmails } = require('../services/sendOrderEmails');

exports.handleWebhook = async (req, res) => {
    console.log('Paystack webhook called...');
    const secret = process.env.PAYSTACK_LIVE_SECRET_KEY;

    const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    console.log(`The hash: ${hash}`);
    if (hash !== req.headers['x-paystack-signature']) {
        console.log('Hash was not equal to paystack signature');
        return res.status(401).send('Unauthorized');
    }

    console.log('Signature verified');

    const event = req.body;
    console.log(`Parsed event:`, event);

    if (event.event === 'charge.success') {
        const orderId = event.data.metadata.orderId;

        try {
            const order = await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'PLACED',
                    paymentMethod:
                        event.data.channel === 'mobile_money' ? 'MOBILE_MONEY' : 'CARD',
                    payment: {
                        update: {
                            reference: event.data.reference,
                            amount: event.data.amount / 100,
                            method:
                                event.data.channel === 'mobile_money'
                                    ? 'MOBILE_MONEY'
                                    : 'CARD',
                            status: 'SUCCESS',
                            transactionId: String(event.data.id),
                            channel: event.data.channel,
                            currency: event.data.currency,
                            paidAt: new Date(event.data.paid_at),
                        },
                    },
                },
            });

            await sendOrderEmails(order.id);
            return res.status(200).send('Payment processed');
        } catch (err) {
            console.error('Error updating order from webhook:', err);
            return res.status(500).send('Error updating order');
        }
    } else if (event.event === 'charge.failed' || event.event === 'charge.abandoned') {
        const orderId = event.data.metadata.orderId;

        try {
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'FAILED',
                    payment: {
                        update: {
                            status: 'FAILED',
                        },
                    },
                },
            });

            return res
                .status(200)
                .json({ message: 'Payment failed, order and payment status updated' });
        } catch (err) {
            console.error('Error updating failed payment:', err);
            return res.status(500).send('Error updating failed payment');
        }
    }

    res.status(200).send('Event received');
};
