const User=require("../models/user")
const validate=require('../utils/validator')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const  redisClient  = require('../config/redis')

const Submission = require("../models/submission")


const register=async(req,res)=>{
    try{
        //validate the data first:
         validate(req.body);
         const{firstName,emailId,password}=req.body;

         // user.exist(emailId) you can check this but already defined in schema
         req.body.password=await bcrypt.hash(password,10);
         req.body.role='user';


        
          const user=await User.create(req.body);
          const token=jwt.sign({_id:user._id,emailId:emailId ,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
            const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }

          res.cookie("token", token, {
  maxAge: 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

          res.status(201).json({
            user:reply,
            message:"user register successfully"
          })
    }
    catch(err){
       res.status(400).json({
    message: err.message,
  });

    }
}

// send("error: "+err);


const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Invalid email or password");
    }

    const user = await User.findOne({ emailId });

    // Check whether user exists
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Invalid email or password");
    }

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      {
        _id: user._id,
        emailId: user.emailId,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );

    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      user: reply,
      message: "User logged in successfully",
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

// const login=async(req,res)=>{
//     try{
//         const{emailId,password}=req.body;

//         if(!emailId)
//             throw new Error("invalid credentials");
//         if(!password)
//             throw new Error("invalid credentials");
//           const user= await User.findOne({emailId});

//          const match= await bcrypt.compare(password,user.password);

//          if(!match)
//             throw new Error("invalid creddentials");
//         const reply={
//             firstName:user.firstName,
//             emailId:user.emailId,
//             _id:user._id,
//              role:user.role
//         }

//          const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});

//           res.cookie("token", token, {
//   maxAge: 60 * 60 * 1000,
//   httpOnly: true,
//   secure: true,
//   sameSite: "none",
// });

//           res.status(200).json({
//             user:reply,
//             message:"user login successfully"
//           })


//     }
//     catch(err){
//       return res.status(400).json({
//     message: err.message,
//   });
//     }
// }

//logout feature

const logout=async(req,res)=>{
    try{
        //validate the token
        // token add in redis blocklist
        // cookies ko clear krde last me
          const {token}=req.cookies;
           const payload = jwt.decode(token);
           if (!payload || !payload.exp) {
            throw new Error("Invalid token payload");
        }

       await redisClient.set(`token:${token}`, "Blocked");
   
      await redisClient.expireAt(`token:${token}`,parseInt(payload.exp));
res.cookie("token", "", {
  expires: new Date(0),
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

       res.send("Logged Out Succesfully");

    }
    catch(err){
        res.status(401).send("Error: "+err.message);
    }
}


const adminRegister=async(req,res)=>{
     try{
        //validate the data first:
         validate(req.body);
         const{firstName,emailId,password}=req.body;

         // user.exist(emailId) you can check this but already defined in schema
         req.body.password=await bcrypt.hash(password,10);
         


        
          const user=await User.create(req.body);
          const token=jwt.sign({_id:user._id,emailId:emailId ,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});

         res.cookie("token", token, {
  maxAge: 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

          res.status(201).send("user registered successfully");
    }
    catch(err){
       res.status(400).send("error: "+err);
    }
}


const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}

module.exports={register,login,logout,adminRegister,deleteProfile};