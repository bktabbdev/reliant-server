"use strict";

const { Model, Datatypes, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Employee = sequelize.define(
  "employee",
  {
    empNo: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
      field: "emp_no",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      // field: "last_name",
    },
    companyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      foreignKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
      field: "company_name",
    },
    aerialLift: {
      type: DataTypes.DATE,
      field: "aerial_lift",
    },
    covid: {
      type: DataTypes.DATE,
    },
    firstAid: {
      type: DataTypes.DATE,
      field: "first_aid",
    },
    fitTesting: {
      type: DataTypes.DATE,
      field: "fit_testing",
    },
    forklift: {
      type: DataTypes.DATE,
    },
    handTools: {
      type: DataTypes.DATE,
      field: "hand_tools",
    },
    hazardCommunication: {
      type: DataTypes.DATE,
      field: "hazard_communication",
    },
    ladder: {
      type: DataTypes.DATE,
    },
    liftingTechniques: {
      type: DataTypes.DATE,
      field: "lifting_techniques",
    },
    lockoutTagout: {
      type: DataTypes.DATE,
      field: "lockout_tagout",
    },
    machineSafety: {
      type: DataTypes.DATE,
      field: "machine_safety",
    },
    oxygenAcetylene: {
      type: DataTypes.DATE,
      field: "oxygen_acetylene",
    },
    pesticideHandler: {
      type: DataTypes.DATE,
      field: "pesticide_handler",
    },
    propaneRefill: {
      type: DataTypes.DATE,
      field: "propane_refill",
    },
    respirator: {
      type: DataTypes.DATE,
    },
    tractor: {
      type: DataTypes.DATE,
    },
    welderSafety: {
      type: DataTypes.DATE,
      field: "welder_safety",
    },
  },
  { underscored: true }
);

module.exports = Employee;
