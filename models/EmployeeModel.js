"use strict";

const { Model, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../db/sequelize");

const Employee = sequelize.define("employee", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  uuid: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: UUIDV4,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
  },
  covid: {
    type: DataTypes.DATE,
  },
  firstAid: {
    type: DataTypes.DATE,
  },
  fitTesting: {
    type: DataTypes.DATE,
  },
  forklift: {
    type: DataTypes.DATE,
  },
  handTools: {
    type: DataTypes.DATE,
  },
  hazardCommunication: {
    type: DataTypes.DATE,
  },
  heatIllness: {
    type: DataTypes.DATE,
  },
  ladder: {
    type: DataTypes.DATE,
  },
  liftingTechniques: {
    type: DataTypes.DATE,
  },
  lockoutTagout: {
    type: DataTypes.DATE,
  },
  machineSafety: {
    type: DataTypes.DATE,
  },
  oxygenAcetylene: {
    type: DataTypes.DATE,
  },
  pesticideHandler: {
    type: DataTypes.DATE,
  },
  propaneRefill: {
    type: DataTypes.DATE,
  },
  tractor: {
    type: DataTypes.DATE,
  },
  welderSafety: {
    type: DataTypes.DATE,
  },
});

module.exports = Employee;
