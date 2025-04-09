const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./src/routes/authRoute');
const refreshRoute = require('./src/routes/refreshRoute')
const userRoute = require('./src/routes/usersRoute')

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoute);
app.use('/', refreshRoute);
app.use('/users', userRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

module.exports = app;
