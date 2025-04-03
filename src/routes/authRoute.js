const express = require('express');
const authRoute = express.Router();
const {loginUser, signupUser, signupWithGoogle, signupWithFacebook, getUser} = require('../controllers/authController')


authRoute.post('/login', loginUser);
authRoute.post('signup', signupUser);
authRoute.post('signup/google', signupWithGoogle);
authRoute.post('signup/google', signupWithFacebook);
authRoute.get('/me', getUser);


module.exports = authRoute;