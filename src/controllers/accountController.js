const accountService = require('../services/accountService');


exports.getUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await accountService.getAccount(userId);

        if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
        }

        return res.status(200).json({success: true, user});

    } catch (error){
        console.error(`Error fetching user!`, error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}


exports.updateUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        // later validate data here before update

        const updatedUser = await accountService.updateAccount(userId, data);

        return res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error('Update Account Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update account' });
    }
}


exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both current and new password are required' });
        }

        await accountService.changePassword(userId, currentPassword, newPassword);

        res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
