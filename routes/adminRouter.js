const express = require("express");
const adminController = require("../controllers/admin/adminController");
const upload = require("./../multer.config");

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

adminRouter.patch(
  "/update_company/:id",
  adminController.verify,
  adminController.updateCompany
);

adminRouter.post(
  "/add_company",
  adminController.verify,
  adminController.addCompany
);

adminRouter.delete(
  "/delete_company/:id",
  adminController.verify,
  adminController.deleteCompany
);

adminRouter.post(
  "/add_employee",
  upload.none(),
  adminController.verify,
  adminController.addEmployees
);

adminRouter.get(
  "/employees",
  adminController.verify,
  adminController.getEmployees
);

adminRouter.get(
  "/employee/:id",
  adminController.verify,
  adminController.getEmployee
);

adminRouter.patch(
  "/update_employee/:id",
  adminController.verify,
  adminController.updateEmployee
);

adminRouter.patch(
  "/update_employees",
  adminController.verify,
  adminController.updateEmployees
);

adminRouter.delete(
  "/delete_employee",
  adminController.verify,
  adminController.deleteEmployee
);

module.exports = adminRouter;
