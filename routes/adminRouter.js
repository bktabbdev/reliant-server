const express = require("express");
const adminController = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.get(
  "/companies",
  adminController.verify,
  adminController.getCompanies
);

adminRouter.get(
  "/company/:id",
  adminController.verify,
  adminController.getCompany
);

adminRouter.patch("/updateCompany/:id", adminController.updateCompany);

adminRouter.post("/addCompany", adminController.addCompany);

adminRouter.delete("/deleteCompany/:id", adminController.deleteCompany);

adminRouter.post("/addEmployee", adminController.addEmployees);

adminRouter.get("/employees", adminController.getEmployees);

adminRouter.patch("/updateEmployees", adminController.updateEmployees);

module.exports = adminRouter;
