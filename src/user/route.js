const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {
    login,
    register,
    newToken,
    resetPassword,
    getUsers,
    getUserByID,
    updateUserByID,
    deleteUserByID,
    deleteUsers,
    logout
} = require('./controller');
const {
    registerValidation,
    loginValidation,
    tokenValidation,
    resetPasswordValidation,
    getUserByIDValidation,
    updateUserByIDValidation,
    deleteUserByIDValidation,
} = require('./validation');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/token', tokenValidation, newToken);
router.delete('/logout', authenticate, logout);
router.post('/reset-password', [authenticate, resetPasswordValidation], resetPassword);
router.post('/update', [authenticate, updateUserByIDValidation], updateUserByID);
router.get('/:userID', [authenticate, getUserByIDValidation], getUserByID);
router.delete('/:userID', [authenticate, deleteUserByIDValidation], deleteUserByID);
router.get('/', authenticate, getUsers);
router.delete('/', authenticate, deleteUsers);

module.exports = router;