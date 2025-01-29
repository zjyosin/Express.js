const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    emailID: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female","other"].includes(value.toLowerCase())) {
                throw new Error("gender data is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true
    }
})
userSchema.methods.getJWT = async function () {
 const user = this
  // we have passed id and secrate key "DevConnect@123" which only server knows.
 const token = await jwt.sign({_id: user._id}, "DevConnect@123", { expiresIn: "1d" }) 
 return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {   
    const user = this;
    // Check if the hashed password matches the stored password
    const isPasswordMatched = await bcrypt.compare(passwordInputByUser, user.password);
    return isPasswordMatched;
}

const User = mongoose.model("User", userSchema);

module.exports = User