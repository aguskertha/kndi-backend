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
router.post('/reset-password', resetPasswordValidation ,resetPassword);
router.get('/', getUsers);
router.get('/:userID', getUserByIDValidation, getUserByID);
router.post('/update', updateUserByIDValidation ,updateUserByID);
router.delete('/:userID', deleteUserByIDValidation, deleteUserByID);
router.delete('/', deleteUsers);

module.exports = router;