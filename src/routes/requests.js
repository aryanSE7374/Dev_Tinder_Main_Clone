const express = require("express");
const {userAuth} = require("../middleware/auth")
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId" ,userAuth, async(req,res)=>{
    try{
        const user = req.user;
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored" , "interested"];
        if(!allowedStatus.includes(status)){
            throw new Error ("Check the status")

        }
        const toUserIdExist = await User.findById(toUserId)
        if(!toUserIdExist){
            throw new Error("User not Exist")
        }
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or : [
                {fromUserId , toUserId},
                {fromUserId : toUserId , toUserId : fromUserId}
            ]
        });
        if(existingConnectionRequest){
            res.status(400).json({
                message : "Connection already Exist"
            })
        }
        if (toUserId.toString() === fromUserId.toString()) {
            throw new Error("Cannot send request to yourself");
        }
        const ConnectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status

        });
        const UserConnectionData  = await ConnectionRequest.save();
        res.json({
            message : status==="interested"?req.user.firstName + " is interested in " + toUserIdExist.firstName
            : req.user.firstName + " is not interested in " + toUserIdExist.firstName, 
            data : UserConnectionData
        })

    }
    catch(err){
        res.status(400).json({
            message : `Error ${err.message}`
        });
    }

    

})
requestRouter.post("/request/review/:status/:requestId" , userAuth , async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const allowedStatus = ["accepted" , "rejected"];
        const {status , requestId} = req.params;
        if(!allowedStatus.includes(status)){
            throw new Error(`Status is not valid`)
        }
        const connectionRequest =await  ConnectionRequestModel.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        })
        if(!connectionRequest){
            throw new Error(`Request is decline`)
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message : loggedInUser.firstName + " has accepted the request",
            data : data
        })
        
    }
    catch(err){
        res.status(400).json({
            message : err.message
        })
    }
    
})
module.exports = requestRouter;