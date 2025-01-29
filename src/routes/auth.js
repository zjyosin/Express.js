const express = require('express')
const User = require("../model/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const authRouter = express.Router();

authRouter.use(express.json())
authRouter.use(cookieParser());

authRouter.post("/signUp", async (req, res) => {
  const { firstName, lastName, age, emailID, gender, password } = req.body;
  try {
    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      emailID,
      gender,
      password: passwordHash,
    });
    await user.save();
    res.send("profile created successfully!!");
  } catch (err) {
    res.send("failed to create profile!! " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const userInfo = await User.findOne({ emailID: emailId });
    if (!userInfo) {
      throw new Error("Invalid credentials !!");
    }

    // Verify password
    const isPasswordMatched = await userInfo.validatePassword(password);
    if (isPasswordMatched) {
      const token = await userInfo.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });
      res.send("Login successfully!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Invalid Credentials");
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) }).send("Logout Sucessfully!!")
    
  } catch (err) {
    res.status(400).send("logout Failed!!");
    }
});

module.exports = authRouter;


