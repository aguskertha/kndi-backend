const router = require('express').Router();
const UserController = require('./controller');

router.post('/register', UserController.register);

module.exports = router;