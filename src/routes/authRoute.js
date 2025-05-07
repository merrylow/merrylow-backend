const express = require('express');
const authRoute = express.Router();
const {loginUser, signupUser, authenticateWithGoogle, verifyEmail, forgotPassword, resetPassword, changePassword,  logoutUser} = require('../controllers/authController');
const verifyAccessToken = require('../middleware/verifyAccessToken');


authRoute.post('/login', loginUser);
authRoute.post('/signup', signupUser);
authRoute.post('/signup/google', authenticateWithGoogle);
authRoute.get('/logout', logoutUser);
authRoute.get('/verify', verifyEmail);
authRoute.post('/forgot-password', forgotPassword);
authRoute.post('/reset-password', resetPassword);
authRoute.post('/change-password', verifyAccessToken, changePassword);

module.exports = authRoute;