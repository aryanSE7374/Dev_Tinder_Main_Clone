const express = require("express")
const authRouter = express.Router();
const {validateData} = require("../utils/validations")
const bcrypt = require("bcrypt")
const User = require("../models/user")
authRouter.post('/signup' , async (req , res)=>{
    try{
        validateData(req);
        const {firstName , lastName , email , password} = req.body;
        const passWordHash = await bcrypt.hash(password ,10 )
        const user = new User({
            firstName,
            lastName,
            email,
            password : passWordHash
        });
        await user.save()
        res.send("User added successfully");

    }catch(err){
        res.send(err.message)
    }
    
})
authRouter.post('/login' , async(req , res) => {
    try{
        const {email , password}  = req.body;
        const user = await User.findOne({email : email})
       
        if(!user){
            throw new Error("User is not Valid")
        }
        const isPasswordValid =await user.validatePassword(password)
        
        if(isPasswordValid){
            const token = await user.getJwt();
            console.log(token);
            res.cookie("token" ,  token , { expires: new Date(Date.now() + 900000)});
            res.send(user)
        }
        else{
            throw new Error ("Login is not SuccessFull")
        }

    }catch(err){
        res.send("Error : " + err.message)
    }
})
authRouter.post('/logout' , async (req , res) =>{
    res.cookie("token",null,{expires : new Date(Date.now())})
    res.send("Logout Successfully");
})
module.exports = authRouter;