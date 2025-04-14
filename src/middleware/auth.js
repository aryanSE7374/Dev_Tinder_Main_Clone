const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async(req , res , next)=>{
    //Read the token
    try{
        const {token } = req.cookies;
        if(!token){
            throw new Error ("Token is not Valid")
        }
        const decodedMessage = jwt.verify(token ,"DEVTINDER");
        console.log(decodedMessage)
        const {id} = decodedMessage;
        const user = await User.findById(id);
        if(!user){
            throw new Error("User not Found")
        }
        req.user = user;
        next();

    }
    catch(error){
        res.status(400).send(error.message)
    }
    

    //Validate the token
    // Find the User

}
module.exports = {
    userAuth,
}

    
