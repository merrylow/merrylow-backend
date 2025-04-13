const express = require('express');
const vendorRoute = express.Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const { getVendorRestaurant, getVendorProducts, updateVendorRestaurant, addVendorProduct, updateVendorProduct, deleteVendorProduct } = require('../controllers/vendorController');

vendorRoute.use(verifyAccessToken);

vendorRoute.get('/restaurant', getVendorRestaurant);
vendorRoute.get('/products', getVendorProducts)
vendorRoute.put('/restaurant/:id', updateVendorRestaurant)
vendorRoute.post('/products', addVendorProduct)
vendorRoute.put('/products/:id', updateVendorProduct)
vendorRoute.delete('/products/:id', deleteVendorProduct)

// 	GET /vendor/restaurant vendors can get their own restaurant
// 	GET /vendor/products vendors can get their own products
// 	PUT /vendor/restaurant/:id → Update their own restaurant details (e.g., name, address, cuisine)
// 	POST /vendor/products → Add product
// 	PUT /vendor/products/:id → Update product
// 	DELETE /vendor/products/:id → Remove product

module.exports = vendorRoute;
