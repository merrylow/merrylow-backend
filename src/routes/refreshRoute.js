const refreshRoute = require('express').Router();
const refreshToken = require('../controllers/refreshController');
const verifyRefreshToken = require('../middleware/verifyRefreshToken')


refreshRoute.post('/', verifyRefreshToken,  refreshToken);

module.exports = refreshRoute;