"use strict";

const { Model, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../db/sequelize");

const Training = sequelize.define(
  "training",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: DataTypes.UUID, allowNull: false, defaultValue: UUIDV4 },
    trainingDate: { type: DataTypes.DATE, allowNull: false },
    trainingDoc: { type: DataTypes.STRING },
  }
  // { timestamps: false }
);

module.exports = Training;
