const express = require('express')
const accountRoute = express.Router();
const { getUserAccount, updateUserAccount, changePassword}  = require('../controllers/accountController');
const verifyAccessToken = require('../middleware/verifyAccessToken');

accountRoute.use(verifyAccessToken);

accountRoute.get('/', getUserAccount)
accountRoute.post('/', updateUserAccount)
accountRoute.put('/password', changePassword)


module.exports = accountRoute;