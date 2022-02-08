const User = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const ObjectID = require('mongodb').ObjectID;

const SECRET_KEY = process.env.SECRET_KEY;

const hello = (req, res) => {
    res.json("hello");
}

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if(err){
            res.json({message: 'Error: '+err});
            return false;
        }
        const email = req.body.email;
        const password = hashedPassword;
        const refreshToken = '';
        const name = 'Admin';
        if(!validator.isEmail(email)){
            res.status(400).json({
                message: 'Invalid email'
            })
            return false;
        }
        const newUser = new User({name,email,password, refreshToken});
        newUser.save()
            .then(()=> res.json({message: 'User successfully added'}))
            .catch((err) => res.status(404).json({message: 'Error: '+err}));
    });
}

const login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!validator.isEmail(email)){
        return res.status(400).json({message: 'Bad request: Invalid email!'});  
    }

    User.findOne({email})
        .then((user) => {
            if(user){
                bcrypt.compare(password, user.password, (err, result) => {
                    if(err){
                        return res.status(400).json({message: err});
                    }
                    if(result){
                        const token = generateToken(user);
                        const refreshToken = jwt.sign({userID: user._id}, SECRET_KEY);
                        User.updateOne(
                            {_id: ObjectID(user._id)},
                            {
                                $set: {
                                    refreshToken: refreshToken
                                }
                            }
                        )
                        .then((result) => {
                            res.json({userID: user._id, message: 'Login successfully', token, refreshToken});
                        })
                        .catch((err) => { return res.status(400).json({message: err})});
                    }
                    else{
                        return res.status(400).json({message: 'Bad request: Password does not matched!'})
                    }
                })

            }
            else{
                return res.status(404).json({ message: 'Not found: User not found!'})
            }
        })
        .catch((err) => {
           return res.status(400).json({message: err})
        });
}

const newToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    const userID = req.body.userID;

    if(refreshToken == ''){
        return res.status(400).json({message: 'Bad request: Invalid refresh token!'});
    }
    const user = await User.findOne({_id: ObjectID(userID)});
    if(!user){
        return res.status(404).json({message: 'Not found: User not found!'});
    }
    if(user.refreshToken == ''){
        return res.status(400).json({message: 'Bad request: You need login first!'});
    }
    if(refreshToken == user.refreshToken){
        jwt.verify(refreshToken, SECRET_KEY, (err, result) => {
            if(err){
                return res.status(400).json({message: err});
            }
            const token = generateToken(user);
            res.json({token});
        });
    }
    else{
        return res.status(400).json({message: 'Bad request: Invalid refresh token!'});
    }
}

const generateToken = (user) => {
    return jwt.sign({userID: user._id}, SECRET_KEY, {expiresIn: '20s'});
}

const resetPassword = async (req,res,next) => {
    const userID = req.body.userID;
    const newPassword = req.body.newPassword;
    if(userID.length !== 24){
        return res.status(400).json({message: 'Bad request: Invalid user ID, length must be 24 character!'});
    }
    const user = await User.findOne({_id: ObjectID(userID)});
    if(!user){
        return res.status(404).json({message: 'Not found: user nor found!'});
    }
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if(err){
            res.json({message: err});
            return false;
        }
        User.updateOne(
            { _id: ObjectID(user._id)},
            {
                $set: {
                    password: hashedPassword
                }
            }
        )
        .then((result)=>{
            res.json({message: 'Password successfully changed'});
        })
        .catch((err) => res.status(400).json({message: err}));
    });
}

const getUsers = (req, res, next) => {
    User.find()
        .then((users) => res.json({users}))
        .catch((err) => res.status(400).json({message: err}));
}

const getUserByID = (req, res, next) => {
    const userID = req.params.userID;
    if(userID.length !== 24){
        return res.status(400).json({message: 'Bad request: Invalid user ID, length must be 24 character!'});
    }
    User.findOne({_id: ObjectID(userID)})
        .then((user) => {
            if(!user){
                return res.status(404).json({message: 'Not found: User not found!'})
            }
            res.json({user});
        })
        .catch((err) => {
            return res.status(400).json({message: err});
        });
}

const updateUserByID = async (req,res,next) => {
    const user = req.body.user;

    if(user._id.length !== 24){
        return res.status(400).json({message: 'Bad request: Invalid user ID, length must be 24 character!'});
    }
    const isUserValid = await User.findOne({_id: ObjectID(user._id)});
    if(!isUserValid){
        return res.status(404).json({message: 'Not found: user not found!'});
    }
    bcrypt.compare(user.password, isUserValid.password, async (err, result) => {
        if(err){
            return res.status(400).json({message: err});
        }
        if(result){
            if(!validator.isEmail(user.email)){
                return res.status(400).json({message: 'Bad request: Invalid email!'});
            }
            const isUserEmail = await User.findOne({email: user.email});
            if(isUserEmail){
                if(isUserValid.email !== isUserEmail.email){
                    return res.status(400).json({message: 'Bad request: Email already exist!'});
                }
            }
            
            User.updateOne(
                {_id: ObjectID(user._id)},
                {
                    $set: {
                        name: user.name,
                        email: user.email
                    }
                }
            )
            .then(() => res.json({message: 'User successfully updated!'}))
            .catch((err) => res.status(400).json({message: err}));
        }
        else{
            return res.status(400).json({message: 'Bad request: Invalid password!'});
        }
    });

}

const deleteUserByID = async (req,res,next) => {
    const userID = req.params.userID;
    if(userID.length !== 24){
        return res.status(400).json({message: 'Bad request: Invalid user ID, length must be 24 character!'});
    }
    const user = await User.findOne({_id: ObjectID(userID)});
    if(user){
        User.deleteOne({_id: user._id})
            .then(() => {
                res.json({message: 'User successfully deleted!'});
            })
            .catch((err) => res.status(400).json({message: err}));
    }
    else{
        return res.status(404).json({message: 'Not found: user not found!'});
    }
}

const deleteUsers = (req, res, next) => {
    User.deleteMany()
        .then(() => {
            res.json({message: 'Users successfully deleted'})
        })
        .catch((err) => {
            res.status(400).json({message: err})
        })
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
    hello
}