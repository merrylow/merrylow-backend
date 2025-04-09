const express = require('express')
const cookieParser = require("cookie-parser");
const authService = require('../services/authService')
const setRefreshToken = require('../utils/setRefreshToken')
const saveRefreshToken = require('../utils/saveRefreshToken')

const app = express()
app.use(express.json())
app.use(cookieParser())

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const {accessToken, refreshToken} = await authService.loginUserService(email, password);

        setRefreshToken(res, refreshToken);

        res.json({accessToken});
    }catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.signupUser = async (req, res) => {
    const {username, email, password} = req.body;
    // later get the user's role as well if its available and include it in the signup process
    // we can also validate the user's email to make sure its valid and genuine
    if (!username || !email || !password) {
        return res.status(400).json({message: 'Please fill in all fields'})
    }
    try {
        const user = await authService.signupUserService(username, email, password);
        console.log('User created:', user);
        const {accessToken, refreshToken} = await authService.loginUserService(email, password);
        await saveRefreshToken(user.id, refreshToken);
        setRefreshToken(res, refreshToken);

        res.json({accessToken});
    }
    catch (error) {
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
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token found" });
        }

        // Delete refresh token from the database
        await authService.removeRefreshToken(refreshToken);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
