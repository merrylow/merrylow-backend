const express = require('express');
const productRoute = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');
const verifyAccessToken = require('../middleware/verifyAccessToken');

// users dont really need an access token to view products

productRoute.get('/', getProducts);
productRoute.get('/:id', getProductById);

module.exports = productRoute;