const fs = require("fs");
const path = require("path");

const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const Company = require("../../models/CompanyModel");
const Employee = require("../../models/EmployeeModel");
const Training = require("./../../models/TrainingModel");
const sequelize = require("../../db/sequelize");
const app = require("../../app");

const utils = require("./../../utils/util.string");

const uploadFile = (nameObject, filePath) => {
  //recreate path string for storage in db - return
  if (filePath) {
    const { name, type, num, ext } = nameObject;
    const newPath =
      "./public/uploads/trainings/" +
      utils.newTrainingPath(name, type, num, ext);
    console.log(newPath);
    //update pdf name in trainings folder
    fs.rename(filePath, newPath, (err) => {
      if (err) throw err;
      console.log("fsRename conduct_training");
    });
    return newPath;
  } else {
    //if filePath is null (no file) unlink file - redundant
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log("UNLINK");
    });
    return filePath;
  }
};

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
  const { uuid, companyName } = req.body;
  console.log("companySpecs", req.body);

  Company.update(
    {
      companyName: companyName,
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

/* 
  ToDo - move file.size validation to multer
*/
exports.conductTraining = async (req, res, next) => {
  console.log("UPDATE EMPLOYEES");

  const nameStr = JSON.parse(req.body.training).company.companyName.trim(); // to be used in file naming
  const data = JSON.parse(req.body.training);
  const { date, employees, trainings, company } = data;
  const file = req.file;

  const filePath = file ? `./public/uploads/trainings/${file.filename}` : null; // to be used if validation fails (remove file from system)

  if (file.size > 4194303) {
    return next(new AppError("PDF must be less than 4MB", 401));
  }
  console.log("data: ", data);

  let { uuid } = company;

  // Basic Validation - Assess date
  if (date === null || date === undefined)
    return next(new AppError("Date did not fit the specified format", 422));
  let trainingArray = ["id", "uuid", "lastName"];

  //Assessing which trainings to update
  let updateObj = {};
  trainings.forEach((training) => {
    updateObj = { ...updateObj, [training]: date };
    trainingArray.push(training);
  });

  try {
    //Get num Trainings
    const trainingPromise = await Training.findAndCountAll();
    const num = trainingPromise.count;

    // Get company Id
    let company = await Company.findAll({
      where: {
        uuid: uuid,
      },
      attributes: ["id", "companyName"],
    });
    const compId = company[0].dataValues.id;

    //Update Employees
    let empUpd = await Employee.update(updateObj, {
      where: {
        uuid: employees,
      },
      returning: true,
    });

    // Prepare training path
    const nameObj = {
      name: company[0].dataValues.companyName.trim(),
      type: "training",
      num: num + 1,
      ext: ".pdf",
    };
    const newPath = uploadFile(nameObj, filePath);

    //Create training with updated file path
    let result = Training.create({
      trainingDate: date,
      trainingDoc: newPath,
      companyId: compId,
    });

    if (result) res.status(200).send();

    //Remove file installed in Multer
    // fs.unlink(filePath, (err) => {
    //   if (err) throw err;
    //   console.log("UNLINK");
    // });
    // return next(new AppError("File Upload Error", 400));
  } catch (err) {
    console.log("ERR");
    fs.unlink(filePath, (error) => {
      if (error) throw error;
      console.log("UNLINK");
    });
    console.log(err);
    res.status(422).send();
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

exports.getTraining = async (req, res, next) => {
  console.log("getTraining");
  let { uuid } = req.params;
  console.log("uuid: ", uuid);
  let training = await Training.findAll({
    where: {
      uuid: uuid,
    },
    attributes: { exclude: ["id"] },
  });
  console.log(training[0].dataValues);
  if (training[0] !== undefined || training[0] !== null)
    // res.status(200).send(training[0].dataValues.trainingDoc);
    res.send();
  else return next(new AppError("No Training Found", 404));
};
