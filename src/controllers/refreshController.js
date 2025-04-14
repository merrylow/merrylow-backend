const generateTokens = require('../utils/generateToken')

const refreshToken =  async ( req, res) => {
    const user = req.user; 
    if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    const {accessToken} = generateTokens(user.id, user.userRole, user.email);
    return res.status(200).json({accessToken});
}

module.exports = refreshToken;