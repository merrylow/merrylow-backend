const express = require('express');
const cookieParser = require('cookie-parser');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET;
const frontendUrl = process.env.FRONTEND_HOMEPAGE;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const verifyGoogleIdToken = require('../utils/verifyGoogleIdToken');
const generateToken = require('../utils/generateToken');
const { sendError, sendSuccess } = require('../utils/responseHandler');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(cookieParser());

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await authService.loginUserService(
            email,
            password,
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return sendSuccess(res, 200, { accessToken, refreshToken }, 'Login successful');
    } catch (error) {
        if (error.message === 'User not found' || error.message === 'Invalid password') {
            return sendError(res, 400, 'Invalid User Credentials!');
        }
        return sendError(res, 500, 'Internal server error', error);
    }
};

exports.signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!email || !password || !username) {
            return sendError(res, 400, 'All fields are required');
        }

        await authService.signupUserService(username, email, password);

        return sendSuccess(res, 200, {}, 'Verification email sent!');
    } catch (error) {
        return sendError(res, 500, 'Signup failed', error);
    }
};

exports.signUpWithEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendError(res, 400, 'Email is required');
        }

        const username = email?.split('@')[0];

        await authService.signupUserService(
            username,
            email,
            (password = null),
            (role = 'CUSTOMER'),
        );

        return sendSuccess(res, 200, {}, 'Verification email sent!');
    } catch (error) {
        return sendError(res, 500, 'Signup failed', error);
    }
};

exports.loginWithEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const username = email?.split('@')[0];

        if (!username || !email) {
            return sendError(res, 400, 'Email is required');
        }

        await authService.loginWithEmailService(email);

        return sendSuccess(res, 200, {}, 'Login Verification email sent!');
    } catch (error) {
        if (error.message === 'User not found' || error.message === 'Invalid password') {
            return sendError(res, 400, 'Invalid User Credentials!');
        }
        return sendError(res, 500, 'Internal server error', error);
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        const html = fs.readFileSync(
            path.join(__dirname, '../../public/templates/no-token.html'),
            'utf8',
        );
        return res.status(400).send(html);
    }

    try {
        const payload = jwt.verify(token, EMAIL_TOKEN_SECRET);
        const { email, username, hashedPassword, role } = payload;

        try {
            await authService.createUserAccount(email, username, hashedPassword, role);

            const html = fs.readFileSync(
                path.join(__dirname, '../../public/templates/success.html'),
                'utf8',
            );
            return res.status(200).send(html);
        } catch (userError) {
            if (userError.message === 'User already exists') {
                const html = fs.readFileSync(
                    path.join(__dirname, '../../public/templates/user-exists.html'),
                    'utf8',
                );
                return res.status(409).send(html);
            }

            const html = fs.readFileSync(
                path.join(__dirname, '../../public/templates/creation-error.html'),
                'utf8',
            );
            return res.status(500).send(html);
        }
    } catch (tokenError) {
        const html = fs.readFileSync(
            path.join(__dirname, '../../public/templates/invalid-token.html'),
            'utf8',
        );
        return res.status(400).send(html);
    }
};

exports.verifyEmailForLogin = async (req, res) => {
    const { token } = req.query;

    if (!token) return sendError(res, 400, 'Token is required');

    try {
        const payload = jwt.verify(token, EMAIL_TOKEN_SECRET);

        const { id, role, email } = payload;

        const { accessToken, refreshToken } = generateToken(id, role, email);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        res.redirect(`${homepage}?accessToken=${accessToken}`);
    } catch (err) {
        return sendError(res, 400, err.message || 'Invalid or expired token', err);
    }
};

exports.authenticateWithGoogle = async (req, res) => {
    console.log('Request received at /auth/google');

    const { idToken } = req.body;

    if (!idToken) {
        console.log('no token from google');
        return sendError(res, 400, 'ID token is required');
    }

    try {
        const payload = await verifyGoogleIdToken(idToken);
        if (!payload) {
            console.log('No payload extracted after verification');
            return sendError(res, 401, 'No payload extracted after verification', error);
        }
        const { email, name, picture, sub: googleId } = payload;

        const user = await authService.findOrCreateUser({
            email,
            name,
            picture,
            googleId,
        });
        const { accessToken, refreshToken } = generateToken(
            user.id,
            user.role || 'CUSTOMER',
            user.email,
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return sendSuccess(
            res,
            200,
            {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    imageUrl: user.imageUrl,
                },
            },
            'Google login successful',
        );
    } catch (error) {
        return sendError(res, 401, 'Invalid or expired Google token', error);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email) return sendError(res, 400, 'Email is required');

    if (!newPassword || newPassword.length < 8) {
        return sendError(res, 400, 'A strong password is required!');
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return sendError(res, 404, 'No user with this email');

        await authService.sendPasswordResetEmail(email, newPassword, user);

        return sendSuccess(res, 200, {}, 'Reset password link sent to email');
    } catch (err) {
        return sendError(res, 500, 'Something went wrong', err);
    }
};

exports.changePassword = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return sendError(res, 400, 'Token and is required');
    }

    try {
        await authService.updateUserPassword(token);
        const html = fs.readFileSync(
            path.join(__dirname, '../../public/templates/reset-feedback/success.html'),
            'utf8',
        );
        return res.status(200).send(html);
    } catch (err) {
        if (err.message === 'Invalid or expired token') {
            const html = fs.readFileSync(
                path.join(
                    __dirname,
                    '../../public/templates/reset-feedback/expired.html',
                ),
                'utf8',
            );
            return res.status(400).send(html);
        }
        const html = fs.readFileSync(
            path.join(__dirname, '../../public/templates/reset-feedback/error.html'),
            'utf8',
        );
        return res.status(400).send(html);
    }
};

exports.resetPassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return sendError(res, 400, 'Old and new passwords are required');
    }

    if (oldPassword == newPassword) {
        return sendError(res, 400, 'New password must be different.');
    }

    try {
        await authService.resetUserPassword(userId, oldPassword, newPassword);
        return sendSuccess(res, 200, {}, 'Password changed successfully');
    } catch (err) {
        return sendError(res, 400, err.message || 'Failed to change password', err);
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { refreshToken } = req.cookies;

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        if (!refreshToken) {
            return sendSuccess(
                res,
                200,
                {},
                'No refresh token found, but cookie cleared',
            );
        }

        await authService.removeRefreshToken(id);

        return sendSuccess(res, 200, {}, 'Logged out successfully');
    } catch (error) {
        console.error('Error during logout:', error);
        return sendSuccess(
            res,
            200,
            {},
            'Logged out successfully (with server-side issue)',
        );
    }
};
