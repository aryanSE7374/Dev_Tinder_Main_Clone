const validator = require('validator');
const { validate } = require('../models/user');
const validateData = (req)=>{
    const {firstName , lastName , email , password} = req.body;
    if(!firstName || !lastName){
        throw new Error ("Enter the correct username and password")
    }
    else if(!validator.isEmail(email)){
        throw new Error ("Enter the valid email")

    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("Enter Strong Password");
    }
}
const validateEditProfileData = (req)=>{
    const allowedFieldsToEdit = ["firstName", "lastName" , "skills", "email"]
    try{
        const isAllowedEdit = Object.keys(req.body).every((field)=>allowedFieldsToEdit.includes(field));
        return isAllowedEdit;

    }
    catch(err){
        res.send(err.message)
    }
    
    
}
const validatePassword =  (req)=>{
    const {newPassword} = req.body;
    
    if(!newPassword){
        return false
            
    }
    if(!validator.isStrongPassword(newPassword)){
        return false
            
    }
    return true;
        
    
    


}
module.exports = {
    validateData,
    validateEditProfileData,
    validatePassword
}