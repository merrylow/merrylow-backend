const express = require('express');
const cartRoute = express.Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const {getCartItems, addToCart, deleteFromCart, updateCartItem} = require('../controllers/cartController');

cartRoute.get('/cart', verifyAccessToken, getCartItems); 
cartRoute.post('/cart', verifyAccessToken, addToCart);
cartRoute.put('/cart/:id', verifyAccessToken, updateCartItem);    
cartRoute.delete('/cart/:id', verifyAccessToken, deleteFromCart);

module.exports = cartRoute;