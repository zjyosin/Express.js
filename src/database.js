const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://singhjyotiam:Hankermongodbtestkaro@mydatabase.gmsak.mongodb.net/devConnectDB');
}

module.exports = connectDB

//Hankermongodb23@ - mongodbCloud