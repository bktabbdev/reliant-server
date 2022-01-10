const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Company = require("./../models/CompanyModel");
const Employee = require("./../models/EmployeeModel");

exports.verify = async (req, res, next) => {
  next();
};

exports.getCompanies = async (req, res, next) => {
  console.log("GET COMPANIES");
  try {
    let companies = await Company.findAll({
      order: [["companyName", "ASC"]],
    });
    // console.log(companies);
    res.status(201).json(companies);
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

exports.getCompany = async (req, res, next) => {
  console.log("GET COMPANY");
  let { id } = req.params;
  try {
    let company = await Company.findAll({
      where: {
        companyId: id,
      },
    });
    // console.log("company: ", company[0].dataValues);
    if (company.length === 0) {
      return next(new AppError("Data does not exist", 404));
    } else {
      res.status(200).json(company[0].dataValues);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addCompany = async (req, res, next) => {
  console.log("ADD COMPANY");
  const { companyName, type } = req.body;
  console.log(req.body);
  try {
    let alreadyExists = await Company.findAll({
      where: {
        companyName: companyName,
      },
    });

    if (alreadyExists.length > 0)
      return next(new AppError("Company already exists", 403));
    else {
      Company.create({ companyName: companyName, type: type })
        .then((resp) => {
          console.log(resp);
          res.status(201).json({ status: "Success added!" });
        })
        .catch((err) => {
          console.log(err);
          return next(new AppError("Company already exists!", 403));
        });
    }
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.deleteCompany = async (req, res, next) => {
  console.log("DELETE COMPANY");
  try {
    const { id } = req.params;
    console.log(id);
    await Company.destroy({
      where: {
        companyId: id,
      },
    })
      .then((resp) => {
        console.log("then statement");
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err.message);
        res.status(402).send();
      });
  } catch (err) {
    console.log(err);
  }
};

exports.updateCompany = async (req, res, next) => {
  console.log("UPDATE COMPANY");
  const { id, companyName, type } = req.body;
  console.log("companySpecs", req.body);

  Company.update(
    {
      companyName: companyName,
      type: type,
    },
    {
      where: {
        companyId: id,
      },
    }
  )
    .then((resp) => {
      res.status(200).json({ status: "success" });
    })
    .catch((err) => {
      return next(new AppError("Update Failure", 400));
    });
};

exports.getEmployees = async (req, res, next) => {
  console.log("GET EMPLOYEES");

  try {
    let employees = await Employee.findAll({
      order: [["last_name", "ASC"]],
    });
    if (employees.length === 0)
      return next(new AppError("No Employees to Load", 404));
    res.status(200).json(employees);
  } catch (err) {
    console.log("getEmployees ERROR: ", err);
  }
};

exports.addEmployees = async (req, res, next) => {
  console.log("ADD EMPLOYEES");
  const employees = req.body;
  console.log(employees);

  try {
    console.log(employees.length);
    Employee.bulkCreate(employees)
      .then((x) => {
        res.status(201).json({ status: "success" });
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({ status: err.message });
      });
  } catch (err) {
    return next(new AppError("Backend Creation Failure", 422));
  }
};

exports.updateEmployees = async (req, res, next) => {
  console.log("UPDATE EMPLOYEES");
  const { date, employees, trainings } = req.body[0];
  console.log(date, employees, trainings);
  let updateObj = {};
  trainings.forEach((training) => {
    updateObj = { ...updateObj, [training]: date };
  });
  console.log("updateObj: ", updateObj);
  try {
    let emps = await Employee.findAll({
      where: {
        empNo: employees,
      },
    });
    // console.log("emps: ", emps);
    emps.forEach((emp) => {
      emp.update(date, { fields: trainings });
    });

    Employee.update(updateObj, {
      where: {
        empNo: employees,
      },
      returning: true,
      logging: true,
    })
      .then((resp) => {
        console.log("resp: ", resp[0]);
        resp[0] > 0
          ? res.status(204).send()
          : res.status(422).send("Not Found");
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
    return next(new AppError("Backend Update Failure", 500));
  }
};
