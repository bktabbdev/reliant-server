"use strict";

const { Model, Datatypes, DataTypes } = require("sequelize");
const sequelize = require("./../db/sequelize");
const Client = require("./UserModel");
const Employee = require("./EmployeeModel");

const Company = sequelize.define("company", {
  companyId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  numOfEmployees: {
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.ENUM("Industrial", "Agricultural"),
    allowNull: false,
  },
});

Company.hasOne(Client, { foreignKey: "companyId" });
Company.hasMany(Employee, {
  foreignKey: "companyId",
});

module.exports = Company;
