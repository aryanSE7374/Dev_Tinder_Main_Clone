const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User"

        },
        toUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User"
        },
        status : {
            type : String,
            required : true,
            enum : {
                values : ["accepted" , "rejected" , "ignored" , "interested"],
            }

        }
    },
    {
        timestamps : true
    }
);
connectionRequestSchema.index({toUserId : 1 , fromUserId : 1}) // Compund Index Make the query fast
const ConnectionRequestModel = new mongoose.model("ConnectionRequest" , connectionRequestSchema);

module.exports = ConnectionRequestModel