const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const Company = require("../../models/CompanyModel");
const Employee = require("../../models/EmployeeModel");
const sequelize = require("../../db/sequelize");

exports.verify = async (req, res, next) => {
  next();
};

exports.getCompanies = async (req, res, next) => {
  console.log("GET COMPANIES");
  try {
    let companies = await Company.findAll({
      order: [["companyName", "ASC"]],
      attributes: { exclude: ["id"] },
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

    console.log(alreadyExists);

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
  console.log("req.params: ", req.params);
  console.log("req.body: ", req.body);
  try {
    const { id } = req.params;
    console.log(id);
    await Company.destroy({
      where: {
        uuid: id,
      },
    })
      .then((resp) => {
        console.log("delete resp: ", resp);
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
      Employee.update(
        { companyName: companyName },
        { where: { companyId: id } }
      )
        .then(res.status(200).json({ status: "success" }))
        .catch((err) => {
          return next(
            new AppError(
              "Employee Update Failure after Successful Company Update"
            )
          );
        });
    })
    .catch((err) => {
      return next(new AppError("Update Failure", 400));
    });
};

exports.getEmployees = async (req, res, next) => {
  console.log("GET EMPLOYEES");
  try {
    let employees = await Employee.findAll({
      order: [["lastName", "ASC"]],
      attributes: { exclude: ["id", "companyId", "updatedAt"] },
    });
    if (employees.length === 0)
      return next(new AppError("No Employees to Load", 404));
    res.status(200).json(employees);
  } catch (err) {
    console.log("getEmployees ERROR: ", err);
  }
};

exports.getEmployee = async (req, res, next) => {
  res.status(200).send();
};

exports.updateEmployee = async (req, res, next) => {
  const { emp } = req.body;
  console.log("emp: ", emp);
  try {
    Employee.update(emp, {
      where: {
        uuid: emp.uuid,
      },
    })
      .then((resp) => {
        res.status(200).send();
      })
      .catch((err) => {
        console.log(err);
        return next(new AppError("updateEmployee Failure", 403));
      });
  } catch (err) {
    return next(new AppError("Backend Update Failure", 500));
  }
};

exports.addEmployees = async (req, res, next) => {
  console.log("ADD EMPLOYEES");
  console.log(req.body);
  try {
    const data = JSON.parse(req.body.employee);
    let company = await Company.findAll({
      where: { companyName: data[0].companyName },
      attributes: ["id"],
    });
    let companyId = company[0].dataValues;
    //Append foreign key
    for (let i = 0; i < data.length; i++) {
      data[i]["companyId"] = companyId.id;
    }

    //
    console.log("data: ", data);
    console.log("companyId: ", companyId);
    Employee.bulkCreate(data, companyId)
      .then((x) => {
        console.log("179: ", x);
        res.status(201).json({ status: "success" });
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({ status: err.message });
      });
  } catch (err) {
    console.log(err.message);
    // return next(new AppError("Backend Creation Failure", 422));
  }
};

exports.updateEmployees = async (req, res, next) => {
  console.log("UPDATE EMPLOYEES");
  const { date, employees, trainings, compUuid } = req.body[0];
  console.log("req.body: ", req.body);
  if (date === null || date === undefined)
    return next(new AppError("Date did not fit the specified formate", 422));
  let updateObj = {};
  trainings.forEach((training) => {
    updateObj = { ...updateObj, [training]: date };
  });
  console.log("updateObj: ", updateObj);
  try {
    let emps = await Employee.findAll({
      where: {
        uuid: employees,
      },
    });
    console.log("emps: ", emps);
    emps.forEach((emp) => {
      emp.update(date, { fields: trainings });
    });

    Employee.update(updateObj, {
      where: {
        uuid: employees,
      },
      returning: true,
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

exports.deleteEmployee = async (req, res, next) => {
  console.log("deleteEmployee");
  const { uuid } = req.body;
  console.log(req.body);
  Employee.destroy({
    where: {
      uuid: uuid,
    },
  })
    .then((resp) => {
      console.log(resp);
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send();
    });
};
