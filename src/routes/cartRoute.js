const express = require('express');
const cartRoute = express.Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const {getCartItems, addToCart, deleteFromCart, updateCartItem, deleteAllCartItems, updateCartItemQuantity} = require('../controllers/cartController');

cartRoute.get('/', verifyAccessToken, getCartItems); 
cartRoute.post('/', verifyAccessToken, addToCart);
cartRoute.put('/item/:id', verifyAccessToken, updateCartItem); 
cartRoute.patch('/item/:id', verifyAccessToken, updateCartItemQuantity )   
cartRoute.delete('/item/:id', verifyAccessToken, deleteFromCart);
cartRoute.delete('/', verifyAccessToken, deleteAllCartItems)

module.exports = cartRoute;