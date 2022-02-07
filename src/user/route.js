const router = require('express').Router();
const UserController = require('./controller');

router.post('/register', UserController.register);
router.get('/hello', UserController.hello);

module.exports = router;