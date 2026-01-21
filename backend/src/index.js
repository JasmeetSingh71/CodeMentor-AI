// const express=require('express')
// const app=express();
// require('dotenv').config();
// const main=require('./config/db')
// const cookieParser=require('cookie-parser')
// const authRouter = require('./routes/userAuthentication');
// const redisClient=require('./config/redis')
// const problemRouter=require('./routes/problemCreater')
// const submitRouter=require('./routes/submit')
// const aiRouter=require('./routes/aiChatting')
// const videoRouter = require("./routes/videoCreator");
// const cors=require('cors');


// app.use(cors({
// origin:'http://localhost:5173',
// credentials:true
// }

// ))


// app.use(express.json());
// app.use(cookieParser())

// app.use('/user', authRouter);
// app.use('/problem', problemRouter);

// app.use('/submission',submitRouter);
// app.use('/ai',aiRouter);
// app.use("/video",videoRouter);


// const InitializeConnection=async()=>{
//     try{
//         await Promise.all([main(),redisClient.connect()]);
//         console.log("db connected");
//         app.listen(7001,()=>{
//         console.log("server listening at port number: "+process.env.PORT)
//           })

//     }
//     catch(err){
//         console.log("Error "+err);
//     }
// }

// InitializeConnection();

const express = require("express");
const app = express();

require("dotenv").config();

const main = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/userAuthentication");
const problemRouter = require("./routes/problemCreater");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");

const redisClient = require("./config/redis");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);


const InitializeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("db connected");
  } catch (err) {
    console.log("Error " + err);
  }
};

InitializeConnection();

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 7001;
  app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`);
  });
}


module.exports = app;
