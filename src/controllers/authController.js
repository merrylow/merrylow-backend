const express = require('express')
const cookieParser = require("cookie-parser");
const authService = require('../services/authService')
const setRefreshToken = require('../utils/setRefreshToken')

const app = express()
app.use(express.json())
app.use(cookieParser())

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const {accessToken, refreshToken} = await authService.loginUserService(email, password);

        setRefreshToken(res, refreshToken);

        res.json({accessToken, refreshToken});
    }catch (error) {
        if (error.message === 'User not found' || error.message === 'Invalid password') {
            return res.status(400).json({ message: 'Invalid User Credentials!' });
        }
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.signupUser = async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({message: 'Please fill in all fields'})
    }
    try {
        const user = await authService.signupUserService(username, email, password);
        const {accessToken, refreshToken} = await authService.loginUserService(email, password);
        setRefreshToken(res, refreshToken);

        res.json({accessToken, refreshToken});
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'User already exists' });
        }        
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.authenticateWithGoogle = async (req, res) => {
    // get the user from google and create a new user in the database if that user details don't already exist else log the user in
}

exports.authenticateWithFacebook = async (req, res) => {
    // get the user from facebook and create a new user in the database if that user details don't already exist else log the user in
}

exports.logoutUser = async (req, res) => {
//   destroy session; expire the access token; delete the refresh token from the database 
//   res.redirect('/')
}