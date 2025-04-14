const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user")

userRouter.get("/user/request/received" , userAuth , async (req , res)=>{
    try{
        const loggedInUser = req.user;
        const connectionsOfLoggedinUser = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested"
            
        }).populate("fromUserId" ,["firstName" , "lastName"])
        res.json({
            message : "Data fetched Successfully",
            data : connectionsOfLoggedinUser
        })
    }
    catch(err){
        res.status(400).json({
            message : err.message
        })
    }
})
userRouter.get("/user/connections" , userAuth , async(req , res)=>{
    try{
        const loggedInUser = req.user;
        const allConnectionsOfLoggedInUser = await ConnectionRequestModel.find({
            $or : [
                {
                    toUserId : loggedInUser._id,
                    status : "accepted"
                },
                {
                    fromUserId : loggedInUser._id,
                    status : "accepted"

                }
            ]
        }).populate("fromUserId" , ["firstName" , "lastName"]).populate("toUserId" , ["firstName" , "lastName"])

        const dataOfConnections = allConnectionsOfLoggedInUser.map((data)=>{
            if(data.fromUserId._id.toString() === loggedInUser._id.toString()){
                return data.toUserId
            }
            return data.fromUserId
        })
        res.json({
            message : "Matches of " + loggedInUser.firstName,
            data : dataOfConnections
        })

    }
    catch(error){
        res.status(400).json({
            message : `Error : ${error.message}`
        })
    }


}
)
userRouter.get("/feed" , userAuth , async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;
        const connectionRequest = await ConnectionRequestModel.find({
            $or : [
                {
                    toUserId : loggedInUser._id
                },
                {
                    fromUserId : loggedInUser._id
                }
            ]
        }).select("fromUserId toUserId" )

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString())

        })
        
        const usersToShow = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideUserFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
            
        }).select("firstName lastName")
        res.json({
            data : usersToShow
        }).skip(skip).limit(limit)

    }
    catch(err){
        res.status(400).json({
            message : err.message,
        })
    }

})

module.exports = userRouter;