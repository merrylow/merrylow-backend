const generateTokens = require('../utils/generateToken');
const { sendError, sendSuccess } = require('../utils/responseHandler');

const refreshToken =  async ( req, res) => {
    const user = req.user;
    if (!user) {
        return sendError(res, 403, "Invalid refresh token");
    }
    const {accessToken} = generateTokens(user.id, user.userRole, user.email);
    return sendSuccess(res, 200, {accessToken});
}

module.exports = refreshToken;