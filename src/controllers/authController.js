const express = require('express')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const generateTokens = require('../utils/generateToken')
const cookieParser = require("cookie-parser");
const authService = require('../services/authService')

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

        res.json({accessToken});
    }catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.signupUser = async (req, res) => {
    // get the user details from the request body and create and save a new user in the database
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({message: 'Please fill in all fields'})
    }
    // redirect the user to the login page
}

exports.signupWithGoogle = async (req, res) => {
    // get the user from google and create a new user in the database
}

exports.signupWithFacebook = async (req, res) => {
    // get the user from facebook and create a new user in the database
}

exports.logoutUser = async (req, res) => {
//   destroy session; expire the access token; delete the refresh token from the database
//   res.redirect('/')
}