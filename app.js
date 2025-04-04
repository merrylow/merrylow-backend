const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/authRoute');
const refreshRoute = require('./src/routes/refreshRoute')

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoute);
app.use('/', refreshRoute)

module.exports = app;
