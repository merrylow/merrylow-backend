const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const generateTokens = require('../utils/generateToken')
const saveRefreshToken = require('../utils/saveRefreshToken')
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const { getHtmlEmail } = require('../utils/getHtmlEmail');

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET;
const EMAIL_TOKEN_EXPIRY = '10m';


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

        const { accessToken, refreshToken } = generateTokens(user.id, user.role, user.email);

        await saveRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}


exports.signupUserService = async (username, email, password, role) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const emailToken = jwt.sign(
            { username, email, hashedPassword, role },
            EMAIL_TOKEN_SECRET,
            { expiresIn: EMAIL_TOKEN_EXPIRY }
        );

        const verificationLink = `http://localhost:5000/api/auth/verify?token=${emailToken}`;

        await emailService.sendEmail(
            email,
            'Verify your email',
            `Click the link to verify: ${verificationLink}`,
            getHtmlEmail(username, verificationLink)
        );
          

    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
}


exports.createUserAccount = async (email, username, hashedPassword, role ) =>{
  
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) return res.status(400).json({ message: 'User already exists' });

    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
        role
      }
    });

    return newUser;
}


exports.removeRefreshToken = async (refreshToken) => {
    try {
        const userToUpdate = await prisma.user.findFirst({
            where: {
                refreshToken: refreshToken 
            }
        });

        if (!userToUpdate) {
            throw new'No user found with that refresh token.' 
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userToUpdate.id
            },
            data: {
                refreshToken: null
            },
            select: { 
                id: true,
                name: true,
                email: true,
            }
        });

    } catch (error) {
        console.error('Error removing refresh token:', error);
        throw new Error('Failed to remove refresh token');
    }
};
