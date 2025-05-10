const { PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const { sendError, sendSuccess } = require('../utils/responseHandler');


exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                // if there are any other fields you want to be included, i'll add them later
            }
        });

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        return sendSuccess(res, 200, { user });

    } catch (error) {
        return sendError(res, 500, 'Failed to get current user', error);
    }
}