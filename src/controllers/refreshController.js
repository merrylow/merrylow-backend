const generateTokens = require('../utils/generateToken')

exports.refreshToken =  async ( req, res) => {
    const user = req.user; 
    if (!user) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    const {accessToken} = generateTokens(user.id, user.email);
    return res.status(200).json({accessToken});
}