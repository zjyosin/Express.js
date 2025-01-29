const express = require('express');
const User = require("../model/user");
const ConnectionRequest = require("../model/connectionRequest");
const connectionRequestRouter = express.Router();
connectionRequestRouter.use(express.json())
const { userAuth } = require("../middleware/auth");


connectionRequestRouter.get("/getAllUserInfo", userAuth, async (req, res) => {
  try {
    const userDetails = await User.find({});
    res.status(200).send(userDetails);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  /* From my feed either I ignored the profile or request the profile (status : Ignored, Intersted)
  Corner cases - 1 : I cannot ignored or send interested to my own profile
  2: I cannot ignored or send request to users whome I already send request or who have rejected my request
  3: I cannot ignore the user to whom I have send the request
  4: I cannot send the request to user whom I already send the req or ignored and If someone has send(ignored/interested) me request i should not send(ignored/interested) the req to same user */
  try {
    const fromUserId = req.user._id.toString(); // looged In user
    const toUserId = req.params.toUserId; 
    const status = req.params.status;
    const allowedStatus = ["ignored", "interested"]
    // sending invalid status
    if(!allowedStatus.includes(status)) {
      throw new Error(`${status} type is invalid`)
    }
    // If user vijay has send request to user jyoti now jyoti will not able to send request to vijay 
    const isUserExist = await ConnectionRequest.findOne({
      $or: [{ fromUserId, toUserId }, {fromUserId: toUserId , toUserId: fromUserId}] 
    })
    if(isUserExist) {
      throw new Error(`Connection already exist`)
    }
    /* Cannot send request to yourself or instead of writing this here we can create schema middleware 
    so it will check this condition everytime before save */
    // if(fromUserId === toUserId) {
    //   throw new Error(`you cannot send request to yourself`)
    // }

    // cannot send request to user who does not exist in database or invalid userId
    isUserIdExistInDatabase = await User.find({
     _id: toUserId
    })
    if(!isUserIdExistInDatabase) {
      throw new Error(`Invalid User Id`)
    }
    const connectionReq = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
    const connectionReqDetails = await connectionReq.save();
    res.status(200).send(connectionReqDetails + "Connection request sent successfully");
   
  } catch (err) {
    res.status(400).send(err.message);
  }
});


connectionRequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    /* From my requestReceived either I can accept or reject the profile (status: Accepted, Rejected)
    Conditions:
    1- Invalid status is not allowed.
    2- Request Id should be valid or should present in the database.
    3- If status of connectionRequest is interested then only I can uppdate the status to accepted or rejected.
    */
try{
    const toUserId = req.user._id.toString(); // looged In user
    const fromUserId = req.params.requestId; 
    const newStatus = req.params.status;
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(newStatus))  throw new Error(`${newStatus} type is invalid`)
    const isUserIdExistInDatabase = await User.find({
        _id: toUserId
       })
    if(!isUserIdExistInDatabase)  throw new Error(`Invalid User Id`)
    const reviewStatus = await ConnectionRequest.findOne({
      fromUserId,
      toUserId,
      status: "interested"
    });
    console.log(reviewStatus)
    if(reviewStatus) {
      console.log(toUserId, fromUserId, reviewStatus)
      reviewStatus.status = newStatus;
      await reviewStatus.save();
      res.status(200).json({
       data: reviewStatus,
       message: `you have ${newStatus} the request sucessfully`
      })
    } else throw new Error(`you have no pending request for this user`)
  } catch(err) {
    res.status(400).send(err.message)
  }
});
module.exports = connectionRequestRouter;
  
  
  