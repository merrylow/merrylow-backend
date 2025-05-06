const express = require('express')
const cookieParser = require("cookie-parser");
const authService = require('../services/authService')
const saveRefreshToken = require('../utils/saveRefreshToken')
const jwt = require('jsonwebtoken')
const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET;

const app = express()
app.use(express.json())
app.use(cookieParser())


exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const {accessToken, refreshToken} = await authService.loginUserService(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        res.json({accessToken, refreshToken});
    }catch (error) {
        if (error.message === 'User not found' || error.message === 'Invalid password') {
            return res.status(400).json({ message: 'Invalid User Credentials!' });
        }
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}


exports.signupUser = async (req, res) => {
    try {

        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        await authService.signupUserService(username, email, password, role);

        res.status(200).json({ message: 'Verification email sent!' });

    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
};


exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
  
    if (!token) return res.status(400).json({ message: 'Token is required' });
  
    try {
        const payload = jwt.verify(token, EMAIL_TOKEN_SECRET);
    
        const { email, username, hashedPassword, role } = payload;

        const user = await authService.createUserAccount(email, username, hashedPassword, role);
  
        return res.status(200).json({ message: 'Email verified and user created!', data: user });
  
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  };
  

exports.authenticateWithGoogle = async (req, res) => {
    // get the user from google and create a new user in the database if that user details don't already exist else log the user in
}


exports.logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token found" });
        }

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
    //   res.redirect('/')
}