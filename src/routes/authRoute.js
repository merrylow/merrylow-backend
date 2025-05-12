const express = require('express');
const authRoute = express.Router();
const {loginUser, signupUser, loginWithEmail, signUpWithEmail, authenticateWithGoogle, verifyEmail, verifyEmailForLogin, forgotPassword, resetPassword, changePassword,  logoutUser} = require('../controllers/authController');
const verifyAccessToken = require('../middleware/verifyAccessToken');


authRoute.post('/login', loginUser);
authRoute.post('/signup', signupUser);
authRoute.post('/login/email', loginWithEmail);
authRoute.post('/signup/email', signUpWithEmail);
authRoute.post('/google', authenticateWithGoogle);
authRoute.get('/logout', logoutUser);
authRoute.get('/verify', verifyEmail);
authRoute.get('/verify/login', verifyEmailForLogin);
authRoute.post('/forgot-password', forgotPassword);
authRoute.post('/reset-password', resetPassword);
authRoute.post('/change-password', verifyAccessToken, changePassword);

module.exports = authRoute;