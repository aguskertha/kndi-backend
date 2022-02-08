const router = require('express').Router();
const UserController = require('./controller');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/token', UserController.newToken);
router.post('/reset-password', UserController.resetPassword);
router.get('/', UserController.getUsers);
router.get('/:userID', UserController.getUserByID);
router.post('/update', UserController.updateUserByID);
router.delete('/:userID', UserController.deleteUserByID);
router.delete('/', UserController.deleteUsers);
router.get('/hello', UserController.hello);

module.exports = router;