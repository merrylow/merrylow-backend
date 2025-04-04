const jwt = require('jsonwebtoken');
require("dotenv").config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_key";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key";

const generateTokens = (id, email) => {
    const accessToken =  jwt.sign({id, email}, ACCESS_SECRET, {expiresIn: "1h"} )
    const refreshToken = jwt.sign({id, email}, REFRESH_SECRET, {expiresIn: "3d"});

    return {accessToken, refreshToken}
}

module.exports = generateTokens;