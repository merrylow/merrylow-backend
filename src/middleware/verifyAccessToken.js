const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAccessToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token)

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is missing'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid access token'
            });
        }

        req.user = decoded;
        next();
    });
}

module.exports = verifyAccessToken;