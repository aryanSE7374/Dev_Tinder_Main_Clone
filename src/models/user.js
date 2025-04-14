const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 50

    },
    lastName : {
        type :String,
    },
    email :{
        type : String,
        required : true,
        unique :true,
        trim : true,

    },
    password : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
    },
    skills : {
        type : [String]

    },
    photoUrl : {
        type : String

    }
},{
    timestamps : true,
});
userSchema.methods.getJwt = async function () {
    const token = jwt.sign({id : this._id} , "DEVTINDER" , {expiresIn : "1d"});
    return token;

}
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const passwordHash = this.password;
    const isPassWordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    )
    return isPassWordValid;
    
}
module.exports = mongoose.model("User" , userSchema)