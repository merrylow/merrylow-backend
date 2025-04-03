const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const generateTokens = require('../utils/generateToken')
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

        // Generate tokens and store the refresh token in the database
        const { accessToken, refreshToken } = generateTokens(user.id);

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}


exports.signupUserService = async (username, email, password) => {
    try {
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
