const jwt = require('jsonwebtoken');
require("dotenv").config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_key";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key";

const generateTokens = (id, userRole = "CUSTOMER", email) => {
    const accessToken =  jwt.sign({id, userRole, email}, ACCESS_SECRET, {expiresIn: "1d"} )
    const refreshToken = jwt.sign({id, userRole, email}, REFRESH_SECRET, {expiresIn: "7d"});

    return {accessToken, refreshToken}
}

module.exports = generateTokens;