const express = require('express');
const app = express.Router();

const {
    getTopVendors,
    getTopProducts,
} = require('../controllers/trendingController');

app.get('/top-vendors', getTopVendors);
app.get('/top-products', getTopProducts);

module.exports = app;
