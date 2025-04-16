const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./src/routes/authRoute');
const refreshRoute = require('./src/routes/refreshRoute')
const userRoute = require('./src/routes/usersRoute')
const checkoutRoute = require('./src/routes/checkoutRoute')
const orderRoute = require('./src/routes/orderRoute');
const restaurantRoute = require('./src/routes/restaurantRoute')
const productRoute = require('./src/routes/productRoute')
const vendorRoute = require('./src/routes/vendorRoute')
const accountRoute = require('./src/routes/accountRoute')

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('api/auth', authRoute);
app.use('api/refresh', refreshRoute);
app.use('api/users', userRoute);
app.use('api/checkout', checkoutRoute);
app.use('api/orders', orderRoute);
app.use('api/restaurant', restaurantRoute)
app.use('api/products', productRoute);
app.use('api/vendor', vendorRoute);
app.use('api/account', accountRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

module.exports = app;
