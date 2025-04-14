const express = require('express');
const vendorRoute = express.Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const {
    getVendorRestaurant,
    getVendorProducts,
    addVendorRestaurant,
    updateVendorRestaurant,
    addVendorProduct,
    updateVendorProduct,
    deleteVendorProduct,
    deleteVendorRestaurant,
    getVendorProductById,
    getVendorRestaurantById
  } = require('../controllers/vendorController');
  
vendorRoute.use(verifyAccessToken);

vendorRoute.get('/restaurant', getVendorRestaurant);
vendorRoute.get('/products', getVendorProducts)
vendorRoute.get('/products/:id', getVendorProductById);
vendorRoute.get('/restaurant/:id', getVendorRestaurantById);
vendorRoute.post('/products', addVendorProduct)
vendorRoute.post('/restaurant', addVendorRestaurant)
vendorRoute.put('/products/:id', updateVendorProduct)
vendorRoute.put('/restaurant/:id', updateVendorRestaurant)
vendorRoute.delete('/products/:id', deleteVendorProduct)
vendorRoute.delete('/restaurant/:id', deleteVendorRestaurant)


module.exports = vendorRoute;
