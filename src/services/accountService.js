const { PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs')


exports.getAccount = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                location: true,
                createdAt: true,
                updatedAt: true,
                campus: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        throw new Error('Failed to get current user');
    }
}


exports.updateAccount = async (userId, data) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                location: true,
                createdAt: true,
                updatedAt: true,
                campus: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        return updatedUser;
    } catch (error) {
        console.error('Error updating user account:', error);
        throw new Error('Could not update account');
    }
}


exports.changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new Error('Current password is incorrect');

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame || currentPassword === newPassword) throw new Error ('New passowrd must be different from previous one!')

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return true;
    } catch (error) {
        console.error('Change Password Error:', error);
        throw new Error(error.message || 'Failed to change password');
    }
}
