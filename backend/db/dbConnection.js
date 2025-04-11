const mongoose=require('mongoose');
require ('dotenv').config();
const connectDb= async ()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongoose");
}

module.exports=connectDb;