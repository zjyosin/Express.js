const express = require("express");
const connectDB = require("./database");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/connectionRequest");
const userRequestRouter = require("./routes/user");
const deleteProfileRouter = require("./routes/deleteProfile");

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRequestRouter)
app.use("/", deleteProfileRouter)

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen("2333", () => {
      console.log("Server listening...");
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err.message);
  });
