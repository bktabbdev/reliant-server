"use strict";

const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../db/sequelize");

const Client = sequelize.define("client", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "first_name",
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "last_name",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Must be a valid email address" },
    },
  },
  role: {
    type: DataTypes.ENUM("admin", "owner", "employee"),
    allowNull: false,
    defaultValue: "owner",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Client;
