const express=require('express');
const app=express();
const connectDb=require("./db/dbConnection")
const port=3000;
const User=require("./schema/User");
const cors=require('cors');

//middleware for parsing json
app.use(express.json());

app.use(cors());
//for sign up
app.post('/signup',async(req,res)=>{
    const {username,password}=req.body;
    const user= new User({username,password});
    await user.save();
    res.send("registration successful");
})

//for sign in
app.post('/signin',async (req,res)=>{
    const {username,password}=req.body;
    const user=await User.findOne({username});
    if(!user){
        res.status(401).send("Invalid Username or password");
    }
    else{
        if(user.password===password){
            res.send("login successful");
        }
        else{
            res.send("Invalid username or password");
        }
    }
})
connectDb();
app.listen(port,()=>{
    console.log(`server runnning on port ${port}`);
})