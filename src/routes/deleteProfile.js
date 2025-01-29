const express = require('express')
const User = require("../model/user");
const { userAuth } = require("../middleware/auth");
const deleteProfileRouter = express.Router();

deleteProfileRouter.use(express.json())


deleteProfileRouter.delete("/deleteUserbyID", userAuth, async (req, res) => {
    try {
      const userId = req.user._id.toString();
      await User.findByIdAndDelete(userId);
      const userDetails = await User.find({});
      res.status(200).send(userDetails);
    } catch (err) {
      res.status(400).send("Fetching user failed!!");
    }
  });

  module.exports = deleteProfileRouter