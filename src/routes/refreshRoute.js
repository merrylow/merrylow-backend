const refreshRoute = require('express').Router();
const {refreshToken} = require('../controllers/refreshController');
const verifyRefreshToken = require('../middleware/verifyRefreshToken')


refreshRoute.post('/refresh', verifyRefreshToken,  refreshToken);

module.exports = refreshRoute;