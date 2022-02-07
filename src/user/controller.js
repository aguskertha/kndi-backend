const User = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const ObjectID = require('mongodb').ObjectID;

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

module.exports = {
    register,
    hello
}