const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login");

connect.then(()=>{
    console.log("Database connected successfully.");
})
.catch(() =>{
    console.log("Database cannot be connected.")
});
//create schema
const LoginSchema = new mongoose.Schema({
name:{
    type: String,
    required:true
},
password:{
    type:String,
    required:true
}
});

//collection Part
const collection = new mongoose.model("user" , LoginSchema);
module.exports = collection;


