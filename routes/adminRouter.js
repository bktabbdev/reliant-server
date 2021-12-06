const express = require("express");
const adminController = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.get("/company", adminController.verify, adminController.getCompany);

adminRouter.post("/addCompany", adminController.addCompany);

module.exports = adminRouter;
