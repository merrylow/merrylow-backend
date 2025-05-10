const accountService = require('../services/accountService');
const { sendError, sendSuccess } = require('../utils/responseHandler');


exports.getUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await accountService.getAccount(userId);

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        return sendSuccess(res, 200, { user });

    } catch (error) {
        return sendError(res, 500, 'Server Error', error);
    }
}


exports.updateUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        // later validate data here before update

        const updatedUser = await accountService.updateAccount(userId, data);

        return sendSuccess(res, 200, { user: updatedUser });

    } catch (error) {
        return sendError(res, 500, 'Failed to update account', error);
    }
}


exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return sendError(res, 400, 'Both current and new password are required');
        }

        await accountService.changePassword(userId, currentPassword, newPassword);

        return sendSuccess(res, 200, {}, 'Password updated successfully');

    } catch (error) {
        return sendError(res, 400, error.message, error);
    }
}