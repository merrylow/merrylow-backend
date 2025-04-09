const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyRefreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(403).json({ message: "No refresh token provided" });
    }

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
        });

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        req.user = payload;
        next();

    } catch (error) {
        console.error('Refresh token error:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            // probably we should clear the users cookie and ask the user to login again for security reasons
            res.status(403).json({ message: 'Invalid or expired refresh token' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};


module.exports =  verifyRefreshToken ;