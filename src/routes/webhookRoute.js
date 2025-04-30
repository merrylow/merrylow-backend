const express = require('express');
const router = express.Router();
const paystackWebhook = require('../controllers/paystackWebhook');

router.post('/paystack', express.json({ verify: (req, res, buf) => req.rawBody = buf }), paystackWebhook.handleWebhook);

module.exports = router;
