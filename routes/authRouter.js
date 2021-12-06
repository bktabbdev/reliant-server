//Node Imports
const express = require("express");

//Local Imports
const authController = require("../controllers/authController");

//Declaring Instance of Router
const authRouter = express.Router();

//Code Body
authRouter.route("/signin").post(authController.loginPost);

authRouter.route("/register").post(authController.registerPost);

module.exports = authRouter;
