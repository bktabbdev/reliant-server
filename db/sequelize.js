const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: "reliant",
  username: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
