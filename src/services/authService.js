const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generateTokens = require('../utils/generateToken');
const saveRefreshToken = require('../utils/saveRefreshToken');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const { getHtmlEmail } = require('../utils/getHtmlEmail');
const { getLoginEmail } = require('../utils/getLoginHtmlEmail');
const { getPasswordResetHtml } = require('../utils/getPasswordResetHtml');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const backend_url = process.env.BACKEND_URL;
const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET;
const EMAIL_TOKEN_EXPIRY = '10m';
const PASSWORD_RESET_EXPIRY = '2m';

exports.loginUserService = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const { accessToken, refreshToken } = generateTokens(
            user.id,
            user.role,
            user.email,
        );

        await saveRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

exports.signupUserService = async (username, email, password, role = 'CUSTOMER') => {
    try {
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const emailToken = jwt.sign(
            { username, email, hashedPassword, role },
            EMAIL_TOKEN_SECRET,
            {
                expiresIn: EMAIL_TOKEN_EXPIRY,
            },
        );

        const verificationLink = `${backend_url}api/auth/verify?token=${emailToken}`;

        await emailService.sendEmail(
            email,
            'Verify your email',
            `Click the link to verify: ${verificationLink}`,
            getHtmlEmail(username, verificationLink),
        );
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
};

exports.loginWithEmailService = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                role: true,
                email: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const emailToken = jwt.sign(
            { id: user.id, role: user.role, email },
            EMAIL_TOKEN_SECRET,
            { expiresIn: '15m' },
        );

        const loginLink = `${backend_url}/auth/verify/login/?token=${emailToken}`;

        await emailService.sendEmail(
            email,
            'Login',
            `Click the link to login: ${loginLink}`,
            getLoginEmail(user.name, loginLink),
        );
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

exports.verifyGoogleIdToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload();
};

exports.findOrCreateUser = async ({ email, name, picture, googleId }) => {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name,
                email,
                imageUrl: picture,
                providerId: googleId,
            },
        });
    }

    return user;
};

exports.createUserAccount = async (email, username, hashedPassword, role) => {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) throw new Error('User already exists');

    const newUser = await prisma.user.create({
        data: {
            name: username,
            email,
            password: hashedPassword,
            role,
        },
    });

    return newUser;
};

exports.sendPasswordResetEmail = async (email, newPassword, user) => {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const token = jwt.sign(
        { email: email, password: hashedNewPassword },
        process.env.JWT_RESET_SECRET,
        {
            expiresIn: PASSWORD_RESET_EXPIRY,
        },
    );
    const resetLink = `${backend_url}api/auth/change-password?token=${token}`;

    await emailService.sendEmail(
        email,
        'Reset your password',
        `Reset link: ${resetLink}`,
        getPasswordResetHtml(user.name || 'there', resetLink),
    );

    return true;
};

exports.updateUserPassword = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const { email, password } = decoded;

        await prisma.user.update({
            where: { email },
            data: { password },
        });

        return true;
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            throw new Error('Invalid or expired token');
        }

        throw new Error(err.message || 'An unexpected error occurred');
    }
};

exports.resetUserPassword = async (userId, oldPassword, newPassword) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error('Old password is incorrect');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
    });

    return true;
};

exports.removeRefreshToken = async (id) => {
    try {
        await prisma.user.update({
            where: {
                id,
            },
            data: {
                refreshToken: null,
            },
        });
    } catch (error) {
        console.error('Error removing refresh token:', error);
        throw new Error('Failed to remove refresh token');
    }
};
