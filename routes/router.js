const express = require("express");

//Imports
const authController = require("./../controllers/authController");

//Declaring Instances
const authRouter = express.Router();

//Code Body
authRouter.route("/signin").post(authController.loginPost);

module.exports = authRouter;
