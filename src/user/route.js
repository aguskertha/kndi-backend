const router = require('express').Router();
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
router.delete('/logout', logout);
router.post('/reset-password', resetPasswordValidation ,resetPassword);
router.post('/update', updateUserByIDValidation ,updateUserByID);
router.get('/:userID', getUserByIDValidation, getUserByID);
router.delete('/:userID', deleteUserByIDValidation, deleteUserByID);
router.get('/', getUsers);
router.delete('/', deleteUsers);

module.exports = router;