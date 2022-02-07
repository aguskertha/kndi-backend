const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {swaggerDocs, swaggerUi} = require('./utils/docs');
const router = require('./src/routes');
require('dotenv').config();
require('./utils/db');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const userRouter = require('./src/user/route');
app.use('/api/auth', userRouter);

app.get('/', (req,res) => {
    res.json('Hello World')
})



module.exports = app;
