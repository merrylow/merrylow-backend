const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

const saveRefreshToken = async (userId, refreshToken) => {
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
    catch (error) {
        console.error('Error saving refresh token:', error);
        throw new Error('Failed to save refresh token');
    }
}

module.exports = saveRefreshToken;