const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Company = require("./../models/CompanyModel");

exports.verify = async (req, res, next) => {
  next();
};

exports.getCompany = async (req, res, next) => {
  try {
    let companies = await Company.findAll();
    res.status(201).send(companies);
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

exports.addCompany = async (req, res, next) => {
  const { addInput } = req.body;
  try {
    let alreadyExists = await Company.findAll({
      where: {
        companyName: addInput,
      },
    });

    // if (alreadyExists.length > 0)
    // return next(new AppError("Company already exists", 403));
    // else {
    Company.create({ companyName: addInput })
      .then((resp) => {
        console.log(resp);
        res.status(201).json({ status: "Success added!" });
      })
      .catch((err) => {
        return next(new AppError("Company already exists", 403));
      });

    // res.status(201).json({ status: "success" });
    // }
  } catch (err) {
    next(new AppError("Internal Server Error: AddCompany", 500));
  }
};
