const express = require('express');
const authRoute = express.Router();
const {loginUser, signupUser, authenticateWithGoogle, verifyEmail, logoutUser} = require('../controllers/authController')


authRoute.post('/login', loginUser);
authRoute.post('/signup', signupUser);
authRoute.post('/signup/google', authenticateWithGoogle);
authRoute.get('/logout', logoutUser);
// authRoute.post('/forgot-password');
// authRoute.post('/reset-password');
authRoute.get('/verify', verifyEmail);


module.exports = authRoute;