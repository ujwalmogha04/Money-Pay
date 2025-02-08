const mongoose  = require("mongoose");


const userSchema = new mongoose.Schema({
    username : {type : "email" , required : "true" , unique : "true"},
    password : {type : "password" , required : "true"},
    name  : {type : "string" , required : "true" }
})

const userModel = mongoose.model("userModel" , userSchema);

module.exports = {
    userModel
}