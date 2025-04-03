const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const generateTokens = require('../utils/generateToken')
const saveRefreshToken = require('./saveRefreshToken')
const bcrypt = require('bcryptjs')

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

        // Generate tokens and save the refresh token in the database
        const { accessToken, refreshToken } = generateTokens(user.id, user.email);
        await saveRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}


exports.signupUserService = async (username, email, password) => {
    try {
<<<<<<< HEAD
        // try and validate the user's email to make sure its valid and genuine

        // after validation, we can now save the user's details in the database
=======
        // attempt to create an account and prisma will throw an error if the user already exists

>>>>>>> ca5df8adfe52802ab399578feb8acedbdd74096e
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return newUser;
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
}

exports.removeRefreshToken = async (refreshToken) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { refreshToken },
            data: { refreshToken: null },
            select: {
                id: true,
                username: true,
                email: true,
                password: false,
            }
        });

        return { success: true, message: 'Refresh token removed successfully', updatedUser };
    } catch (error) {
        if (error.code === 'P2025') {
            // P2025: Record not found in Prisma
            console.warn('No user found with the given refresh token.');
            return { success: false, message: 'Refresh token not found' };
        }

        console.error('Error removing refresh token:', error);
        throw new Error('Failed to remove refresh token');
    }
};