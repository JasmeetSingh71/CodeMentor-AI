const jwt=require('jsonwebtoken');
const redisClient=require('../config/redis')
const User=require('../models/user')
const userMiddleware=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token)
            throw new Error("no token present");
       const payload=  jwt.verify(token,process.env.JWT_KEY);

       const {_id}=payload;

       if(!_id)
       {
        throw new Error("invalid token");
       }

       const result=await User.findById(_id);

       if(!result)
       {
        throw new Error("user does not exist ");
       }
       //redis blocklist me present to nhi haa
       
       const Isblocked=await redisClient.exists(`token:${token}`);

       if(Isblocked)
        throw new Error("invalid token");

       req.result=result;

       next();

    }
    catch(err){
         return res.status(401).json({
        message: err.message,
    });
    }
}

module.exports = userMiddleware;