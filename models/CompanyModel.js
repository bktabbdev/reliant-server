"use strict";

const { Model, Datatypes, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("./../db/sequelize");
const Client = require("./UserModel");

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
});

Company.hasMany(Client);

module.exports = Company;
