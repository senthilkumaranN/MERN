const jwt  =  require('jsonwebtoken');
const User = require('../Model/Register');

const protect = async (req,res,next) =>{
    try{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]
    

    if(!token){
        return res.status(401).json({
            message: "unauthorized"
        })
    }

    const decoded = jwt.verify(token, process.env.jwt_secret_key);
    req.user = await User.findById(decoded.id).select('-password');
    if(!req.user){
        res.status(401).json({
            success: false,
            message: "user not found"
        })
    }
    next();
}catch{
    res.status(401).json({
        message:"Token is not vaild"
    })
}
}

const admin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user data' });
    }

    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
};

module.exports = {protect,admin}