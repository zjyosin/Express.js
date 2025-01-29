const express = require("express")
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData, validateUpdatePasswordData } = require("../util/validate")
const profileRouter = express.Router();

profileRouter.use(express.json())

// Get Profile Info
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { emailId } = req.body;
    const userInfo = req.user; // from the middleware
    if (userInfo.emailID !== emailId) {
      res.status(400).send("User does not exist !!");
    }    
    res.status(200).send(userInfo);
  } catch (err) {
    res.status(400).send("User does not exist!!");
  }
});

// Edit profile details except email and password
profileRouter.patch("/profile/edit", userAuth, async(req,res)=> {
try{

    if(!validateEditProfileData(req)) {
        throw new Error("Invalid Edit request")
    } else {
        const userId = req.user._id;
        const userDetails = await User.findByIdAndUpdate(userId, req.body , { new: true})
        res.status(200).send("Update details sucessfully !" + userDetails)
    }

} catch(err){
    res.status(400).send(err.message)
}
});


// Forget Password
profileRouter.patch("/profile/password", async (req, res) => {
  try {
    // if user click on forget password verify email exist in the database or not 
    // if yes -> update with the new password
    // if no -> throw error
    if(!validateUpdatePasswordData(req)) {
        throw new Error("Invalid edit details")
    } else {
        const { emailId, password } = req.body;
        const userDetailsInDataBase = await User.findOne({ emailID: emailId });
        if(userDetailsInDataBase){
            if(password) {
                // Encrypt password if it's part of the update
                const newPassword = await bcrypt.hash(password, 10);        
                userDetailsInDataBase.password = newPassword;
                await userDetailsInDataBase.save();
                return res.status(200).send('Password updated successfully!');
            } else throw new Error('provide new password!!')
        } else throw new Error('User not found!')
    }
  } catch (err) {
    res.status(400).send("User does not exist!!");
  }
});

// profileRouter.patch("/UpdateUserInfo", userAuth, async (req, res) => {
//   const { _id, password, ...data } = req.body;

//   try {
//     // Check if the user is updating their own info
//     if (_id !== req.user._id.toString()) {
//       return res.status(403).send("Unauthorized action!");
//     }

//     // Encrypt password if it's part of the update
//     if (password) {
//       const passwordHash = await bcrypt.hash(password, 10);
//       data.password = passwordHash;
//     }

//     // Update user information
//     const userDetails = await User.findByIdAndUpdate(_id, data, {
//       new: true,
//     });

//     res.status(200).send("Updated Successfully!!" + userDetails);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// 


//

module.exports = profileRouter;