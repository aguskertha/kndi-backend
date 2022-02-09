const User = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectId;

const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
            return res.json({ message: [err] });
        }
        try {
            const email = req.body.email;
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: ['Email already exist!'] });
            }
            const password = hashedPassword;
            const refreshToken = '';
            const name = 'Admin';
            const newUser = new User({ name, email, password, refreshToken });
            await newUser.save();
            res.json({ message: 'User successfully added' });
        }
        catch (err) {
            res.status(404).json({ message: [err] });
        }
    });
}

const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email });
        let errors = [];
        if (!user) {
            errors.push('User not found!');
        }
        else {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                errors.push('Password does not matched!');
            }
        }
        if (!errors.length == 0) {
            return res.status(400).json({ message: errors });
        }
        const token = generateToken(user);
        const refreshToken = jwt.sign({ userID: user._id }, SECRET_KEY);
        const updatedUser = await User.updateOne(
            { _id: ObjectID(user._id) },
            {
                $set: {
                    refreshToken: refreshToken
                }
            }
        );
        res.json({ userID: user._id, message: 'Login successfully', token, refreshToken });
    }
    catch (err) {
        res.status(400).json({ message: [err] })
    }
}

const newToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        const userID = req.body.userID;
        let errors = [];

        const user = await User.findOne({ _id: ObjectID(userID) });
        if (!user) {
            errors.push('User not found!');
        }
        else {
            if (refreshToken != user.refreshToken) {
                errors.push('Invalid refresh token!');
            }
        }

        if (!errors.length == 0) {
            return res.status(400).json({ message: errors });
        }

        const isValidRefreshToken = jwt.verify(refreshToken, SECRET_KEY);
        if (isValidRefreshToken) {
            const token = generateToken(user);
            res.json({ token });
        }
    }
    catch (err) {
        res.status(400).json({ message: [err] })
    }
}

const generateToken = (user) => {
    return jwt.sign({ userID: user._id }, SECRET_KEY, { expiresIn: '20s' });
}

const resetPassword = async (req, res, next) => {
    try { 
        const userID = req.body.userID;
        const newPassword = req.body.newPassword;

        const user = await User.findOne({ _id: ObjectID(userID) });
        if (!user) {
            return res.status(400).json({ message: ['User not found!'] });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        if (hashedPassword) {
            const updatedUser = await User.updateOne(
                { _id: ObjectID(userID) },
                {
                    $set: {
                        password: hashedPassword
                    }
                }
            );
            res.json({ message: 'Password successfully changed' });
        }
    }
    catch (err) {
        res.status(400).json({ message: [err] })
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({ users });
    }
    catch (err) {
        res.status(400).json({ message: [err] });
    }
}

const getUserByID = async (req, res, next) => {
    try {
        const userID = req.params.userID;
        const user = await User.findOne({ _id: ObjectID(userID) });
        if (!user) {
            return res.status(400).json({ message: ['User not found!'] });
        }
        res.json({ user });
    }
    catch (err) {
        res.status(400).json({ message: [err] });
    }
}

const updateUserByID = async (req, res, next) => {
    try {
        const user = req.body.user;
        let errors = [];
        const isUserValid = await User.findOne({ _id: ObjectID(user._id) });
        if (!isUserValid) {
            errors.push('User not found!');
        }
        else {
            const validPassword = await bcrypt.compare(user.password, isUserValid.password);
            if (!validPassword) {
                errors.push('Password does not matched!');
            }
            const isUserEmail = await User.findOne({ email: user.email });
            if (isUserEmail) {
                if (isUserValid.email !== isUserEmail.email) {
                    errors.push('Email already exist!');
                }
            }
        }
        if (!errors.length == 0) {
            return res.status(400).json({ message: errors });
        }
        const updatedUser = await User.updateOne(
            { _id: ObjectID(user._id) },
            {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
        )
        res.json({ message: 'User successfully updated!' });
    }
    catch (err) {
        res.status(400).json({ message: [err] });
    }
}

const deleteUserByID = async (req, res, next) => {
    try {
        const userID = req.params.userID;
        const user = await User.findOne({ _id: ObjectID(userID) });
        if (!user) {
            return res.status(400).json({ message: ['User not found!'] });
        }
        const deletedUser = await User.deleteOne({ _id: ObjectID(userID) });
        res.json({ message: 'User successfully deleted!' });
    }
    catch (err) {
        res.status(400).json({ message: [err] });
    }
}

const deleteUsers = async (req, res, next) => {
    try {
        await User.deleteMany();
        res.json({ message: 'Users successfully deleted' });
    }
    catch (err) {
        res.status(400).json({ message: [err] });
    }
}

module.exports = {
    register,
    login,
    newToken,
    resetPassword,
    getUsers,
    getUserByID,
    updateUserByID,
    deleteUserByID,
    deleteUsers,
}