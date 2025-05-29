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

router.post(
    '/paystack',
    express.json({ verify: (req, res, buf) => (req.rawBody = buf) }),
    paystackWebhook.handleWebhook,
);

module.exports = router;
