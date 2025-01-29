const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: {
                values: ["interested", "ignore", "accepted", "rejected"],
                message: "{VALUE} is incorrect status type"
            }

        }
    },
    {
        timestamps: true
    }

);

connectionRequestSchema.index({ fromUserId : 1, toUserId: 1})

// pre is a middleware called before save function is called.
connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
        throw new Error("you cannot send request to yourself")
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequest