const { PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                // if there are any other fields you want to be included, i'll add them later
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get current user'
        });
    }
}