const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, SECRET_KEY);

        req.user = decode;
        req.token = token;
        next();
    }
    catch(err){
        res.status(401).json({message: ['Authentication Failed!']})
    }
}

module.exports = authenticate;