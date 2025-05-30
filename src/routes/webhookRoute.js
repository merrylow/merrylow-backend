/**
 * Express router for handling Paystack webhook events.
 *
 * The `express.json()` middleware includes a `verify` function that stores
 * the raw request body in `req.rawBody`. This is necessary for verifying
 * the webhook's authenticity before processing the JSON payload.
 *
 * Endpoint: POST /paystack
 */
const express = require('express');
const router = express.Router();
const paystackWebhook = require('../controllers/paystackWebhook');

// router.post(
//     '/paystack',
//     express.json({ verify: (req, res, buf) => (req.rawBody = buf) }),
//     paystackWebhook.handleWebhook,
// );

// Capture raw body before JSON parsing
router.post(
    '/paystack',
    express.raw({ type: 'application/json' }), // this ensures req.body is a Buffer
    (req, res, next) => {
        req.rawBody = req.body; // store raw body before it gets parsed
        req.body = JSON.parse(req.rawBody.toString()); // manually parse JSON
        next();
    },
    paystackWebhook.handleWebhook,
);

router.get('/', (req, res) => {
    console.log('testing the webhook route...');
    res.status(200).send('The webhook route works...');
});
router.get('/paystack', (req, res) => {
    console.log('testing the webhook/paystack route...');
    res.status(200).send('The webhook/paystack route works...');
});
module.exports = router;
