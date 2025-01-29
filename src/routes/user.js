const express = require('express');
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require('../model/connectionRequest');
const User = require('../model/user');
const userRouter = express.Router();


userRouter.get("/user/request/received", userAuth, async(req,res) => {
    /* view all request you received -> view request which has status interested */
    try{
    const toUserId = req.user._id.toString(); // loggedIn user
    const requestReceived = await ConnectionRequest.find({
        toUserId,
        status: "interested"
    }).populate("fromUserId", "firstName lastName").populate("toUserId", "firstName lastName");
    res.status(200).json({
        message: "fetched requested request sucessfully",
        data: requestReceived
    })
    }catch(err) {
        res.status(400).send("fetching requested request failed")
    }
})

userRouter.get("/user/connections", userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user._id.toString();
        const resultList = await ConnectionRequest.find({
            $or: [{ toUserId : loggedInUser , status: "accepted"},
                  { fromUserId: loggedInUser ,  status: "accepted"}]
        }).populate("fromUserId", "firstName lastName").populate("toUserId", "firstName lastName");

        const connectionList = resultList.map(x => {
            if(loggedInUser === x.toUserId._id.toString()){
                return x.fromUserId
            } else return x.toUserId
        })

        res.status(200).json({
            data: connectionList,
            message: "fetched connected user list sucessfully"
        })
    }catch(err) {
        res.status(400).send("fetching connected user list failed!")
    }
})

userRouter.get("/user/feed?page=1&limit=10", userAuth, async(req, res) => {
    /* list of all the users whose status is not in ["interested", "ignored", "accepted", "rejected"]
    Conditions: 
            1- Don't show list of users to whom LoggedIn user has send request or ignored the request ("interested", "ignored")
            2- Don't show list of users who has requested or ignored the request of loggedIn user ("interested", "ignored")
            3- Don't show list of users whose request was accepted or rejeceted bu LoggedIn user ("accepted", "rejected")
            2- Don't show list of users who has accepted or rejecte the request of loggedIn user ("accepted", "rejected") 
    */
    try {
        const page = parseInt(req.query.page || 1);
        let limit = parseInt(req.query.limit || 10);
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1) * limit;
        const loggedInUser = req.user._id.toString();
        // const resultList =  await ConnectionRequest.find({
        //     $or: [
        //         {fromUserId : loggedInUser , status: "interested"},{fromUserId : loggedInUser , status: "ignored"},
        //         {toUserId : loggedInUser , status: "interested"},{toUserId : loggedInUser , status: "ignored"},
        //         {fromUserId : loggedInUser , status: "accepted"},{fromUserId : loggedInUser , status: "rejected"},
        //         {toUserId : loggedInUser , status: "accepted"},{toUserId : loggedInUser , status: "rejected"}
        //      ]

        // }).populate("fromUserId", "firstName lastName").populate("toUserId", "firstName lastName")

        // above code can be shorten and wrriten like below
        const resultList =  await ConnectionRequest.find({
            $or: [{fromUserId : loggedInUser }, {toUserId : loggedInUser },]
        }).select("fromUserId toUserId");


        const hideUserList = new Set()
        resultList.map(x => {
            hideUserList.add(x.fromUserId.toString())
            hideUserList.add(x.toUserId.toString())
        })

        const userList = await User.find({
            $and: [{_id: {$nin: Array.from(hideUserList)}}, {_id: {$ne: loggedInUser}}]
        }).select("firstName lastName age gender").skip(skip).limit(limit)
       res.status(200).json({ data: userList})
 
    }catch(err) {
        res.status(400).send('Error occured while fetching feed')
    }
})

module.exports = userRouter