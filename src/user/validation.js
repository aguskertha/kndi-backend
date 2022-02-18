const validator = require('validator');

const registerValidation = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let errors = [];
    if (email == '') {
        errors.push('Email required!');
    }
    if (password == '') {
        errors.push('Password required!');
    }
    if (!validator.isEmail(email)) {
        errors.push('Invalid email format!');
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

const loginValidation = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let errors = [];
    if (email == '') {
        errors.push('Email required!');
    }
    if (password == '') {
        errors.push('Password required!');
    }
    if (!validator.isEmail(email)) {
        errors.push('Invalid email format!');
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

const tokenValidation = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    const userID = req.body.userID;
    let errors = [];

    if (userID == '') {
        errors.push('UserID required!');
    }
    if (refreshToken == '') {
        errors.push('Refresh Token required!');
    }

    if(userID){
        if (userID.length !== 24) {
            errors.push('Invalid user ID, length must be 24 character!');
        }
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

const resetPasswordValidation = async (req, res, next) => {
    const userID = req.body.userID;
    const password = req.body.newPassword;
    let errors = [];

    if (userID == '') {
        errors.push('UserID required!');
    }
    if (password == '') {
        errors.push('password required!');
    }
    if (userID.length !== 24) {
        errors.push('Invalid user ID, length must be 24 character!');
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }

}

const getUserByIDValidation = async (req, res, next) => {
    const userID = req.params.userID;
    let errors = [];

    if (userID.length !== 24) {
        errors.push('Invalid user ID, length must be 24 character!');
    }
    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

const updateUserByIDValidation = async (req, res, next) => {
    const user = req.body.user;
    let errors = [];

    if (user.name == '') {
        errors.push('Name required!');
    }
    if (user.email == '') {
        errors.push('Email required!');
    }
    if (user.password == '') {
        errors.push('Password required!');
    }
    if (!validator.isEmail(user.email)) {
        errors.push('Invalid email!');
    }
    if (user._id.length !== 24) {
        errors.push('Invalid user ID, length must be 24 character!');
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

const deleteUserByIDValidation = async (req, res, next) => {
    const userID = req.params.userID;
    let errors = [];

    if (userID.length !== 24) {
        errors.push('Invalid user ID, length must be 24 character!');
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}
module.exports = {
    registerValidation,
    loginValidation,
    tokenValidation,
    resetPasswordValidation,
    getUserByIDValidation,
    updateUserByIDValidation,
    deleteUserByIDValidation
}