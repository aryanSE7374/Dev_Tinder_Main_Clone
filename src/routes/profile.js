const express = require("express");
const authProfile = express.Router();
const {userAuth} = require("../middleware/auth")
const {validateEditProfileData} = require("../utils/validations")
const {validatePassword} = require("../utils/validations")
const bcrypt = require("bcrypt")


authProfile.get('/profile/view' ,userAuth, async(req , res) =>{
    try{
        const user = req.user;
        res.send(user)
    }
    catch(error){
        res.send(error.message);
    }
    
})
authProfile.patch('/profile/edit' , userAuth , async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request")
        }
        
        const LoggedInUser = req.user;
        
        Object.keys(req.body).forEach((key) => { //Important to check if is defined or not 
            if (req.body[key] !== undefined) {
                LoggedInUser[key] = req.body[key]; 
            }
        });
        

        await LoggedInUser.save();
        res.json({
            message : LoggedInUser.firstName + " your profile is upadted",
            data : LoggedInUser
        })
    }catch(err){
        res.send("Error: " + err.message)
    }
    

})
authProfile.patch('/profile/forgotPassword' , userAuth , async (req,res)=>{
    try{
        if(!validatePassword(req)){
            throw new Error(`Invalid Credentials`)
        }
        const LoggedInUser = req.user;
        const {newPassword} = req.body;
        console.log(LoggedInUser)
    
        if(Object.keys(req.body).includes("newPassword")){
            const newPasswordHash = await bcrypt.hash(newPassword,10)

            LoggedInUser.password = newPasswordHash;
            await LoggedInUser.save();
            res.json({
                message : `${LoggedInUser.firstName} your password is updated`,
                data : LoggedInUser
            })
                    
        }
        else{
            res.send("Enter valid details")
        }
        
    }
    catch(err){
        res.status(400).send(`Error ${err}`)
    }


})
module.exports = authProfile;