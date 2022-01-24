"use strict";

const { Model, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("./../db/sequelize");
const Client = require("./UserModel");
const Employee = require("./EmployeeModel");
const Training = require("./TrainingModel");

const Company = sequelize.define("company", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

Company.hasMany(Employee, {
  foreignKey: {
    type: DataTypes.INTEGER,
    allowNull: false,
    name: "companyId",
  },
});
Employee.belongsTo(Company);

Company.hasMany(Training, {
  foreignKey: {
    type: DataTypes.INTEGER,
    allowNull: false,
    name: "companyId",
  },
});
Training.belongsTo(Company);

module.exports = Company;
