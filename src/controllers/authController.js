const express = require('express')
const cookieParser = require("cookie-parser");
const authService = require('../services/authService')
const jwt = require('jsonwebtoken')
const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const verifyGoogleIdToken = require('../utils/verifyGoogleIdToken');

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
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
    }

    try {
        const payload = await verifyGoogleIdToken(idToken);
        const { email, name, picture, sub: googleId } = payload;

        const user = await authService.findOrCreateUser({ email, name, picture, googleId });
        const { accessToken, refreshToken } = generateToken(user.id, role="CUSTOMER", email);

        return res.status(200).json({
            message: 'Google login successful',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl,
            },
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        return res.status(401).json({ message: 'Invalid or expired Google token' });
    }
};



exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    if (!email) return res.status(400).json({ message: 'Email is required' });
  
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'No user with this email' });
    
        await authService.sendPasswordResetEmail(user);
    
        res.status(200).json({ message: 'Reset password link sent to email' });
    } catch (err) {
        console.error('Forgot Password Error:', err.message);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};
  

exports.resetPassword = async (req, res) => {
    const { token } = req.query;
    const { newPassword } = req.body;
  
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
  
    try {
        await authService.resetUserPassword(token, newPassword);
        res.status(200).json({ message: 'Password has been reset successfully' });

    } catch (err) {
        console.error('Reset Password Error:', err.message);
        res.status(400).json({ message: err.message });
    }
};


exports.changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    try {
        await authService.changeUserPassword(userId, oldPassword, newPassword);
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change Password Error:', err.message);
        res.status(400).json({ message: err.message });
    }
};

  
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