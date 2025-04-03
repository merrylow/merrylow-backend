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

        res.status(200).json({accessToken});
    }catch (error) {
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
        if (!user) {
            return res.status(400).json({message: 'User already exists'})
        }
        const {accessToken, refreshToken} = await authService.loginUserService(email, password);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
        res.status(201).json({message: 'User created successfully', accessToken});
    } catch (error) {
        if (error.code === 'P2002') { // Prisma unique constraint violation
            return res.status(400).json({message: 'Email already in use'});
        }
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
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