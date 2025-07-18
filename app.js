const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./src/routes/authRoute');
const refreshRoute = require('./src/routes/refreshRoute');
const userRoute = require('./src/routes/usersRoute');
const checkoutRoute = require('./src/routes/checkoutRoute');
const orderRoute = require('./src/routes/orderRoute');
const restaurantRoute = require('./src/routes/restaurantRoute');
const productRoute = require('./src/routes/productRoute');
const vendorRoute = require('./src/routes/vendorRoute');
const accountRoute = require('./src/routes/accountRoute');
const cartRoute = require('./src/routes/cartRoute');
const webhookRoute = require('./src/routes/webhookRoute');
const homeRoute = require('./src/routes/homeRoute');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/refresh', refreshRoute);
app.use('/api/users', userRoute);
app.use('/api/checkout', checkoutRoute);
app.use('/api/order', orderRoute);
app.use('/api/restaurants', restaurantRoute);
app.use('/api/products', productRoute);
app.use('/api/vendor', vendorRoute);
app.use('/api/account', accountRoute);
app.use('/api/cart', cartRoute);
app.use('/api/webhook', webhookRoute);
app.use('/api', homeRoute);
app.get('/', (req, res) => {
    res.send('Hi, welcome to Merrylow!');
});

module.exports = app;
