const jwt = require('jsonwebtoken');
require("dotenv").config();
const { PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const storeRefreshToken = require('./storeRefreshToken')

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_key";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key";

const generateTokens = (userId, res) => {
    const accessToken =  jwt.sign({userId}, ACCESS_SECRET, {expiresIn: "2h"} )
    const refreshToken = jwt.sign({userId}, REFRESH_SECRET, {expiresIn: "7d"});

    storeRefreshToken(userId, token, res);
    return {accessToken, refreshToken}
}