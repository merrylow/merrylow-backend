const express = require('express');
const authRoute = express.Router();
const {loginUser, signupUser, authenticateWithGoogle, authenticateWithFacebook, getUser} = require('../controllers/authController')


authRoute.post('/login', loginUser);
authRoute.post('signup', signupUser);
authRoute.post('signup/google', authenticateWithGoogle);
authRoute.post('signup/facebook', authenticateWithFacebook);
authRoute.get('/me', getUser);


module.exports = authRoute;