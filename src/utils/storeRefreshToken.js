const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

const storeRefreshToken = async (userId, refreshToken, res) => {
    try {
        await prisma.user.update(
            {
                where: {
                    id: userId
                }, 
                data: {
                    refreshToken
                }
            }
        );
    }
    catch(error){
        console.error('Error storing refresh token:', error);
        res.status(500).json({ error: 'Failed to store refresh token', details: error.message });
    }
}

module.exports = storeRefreshToken;