const router = require('express').Router();
const {swaggerDocs, swaggerUi} = require('../utils/docs');
const userRouter = require('./user/route');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
router.use('/user', userRouter);

module.exports = router;
